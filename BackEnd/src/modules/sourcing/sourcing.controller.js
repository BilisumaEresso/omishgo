// Backend/src/modules/sourcing/sourcing.controller.js
import SourcingRequest from "./sourcing.model.js";
import Message from "../messages/message.model.js";
import User from "../user/user.model.js";
import Notification, { createNotification } from "../notification/notification.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";

export const createSourcingRequest = asyncHandler(async (req, res) => {
  const { cropType, quantity, unit, targetPrice, deliveryRegion, farmerCriteria } = req.body;

  if (!cropType || !quantity || !targetPrice || !deliveryRegion) {
    throw new ApiError(400, "cropType, quantity, targetPrice, and deliveryRegion are required");
  }

  const buyerId = req.user._id;
  const buyerName = req.user.name || "Buyer";

  const request = await SourcingRequest.create({
    buyerId,
    buyerName,
    cropType,
    quantity: Number(quantity),
    unit: unit || "q",
    targetPrice: Number(targetPrice),
    deliveryRegion,
    farmerCriteria: farmerCriteria || {},
    status: "active",
  });

  const targetRegion = farmerCriteria?.region || "";
  let farmerQuery = { role: { $in: ["farmer", "producer"] } };
  if (targetRegion) {
    farmerQuery["location.region"] = { $regex: new RegExp(targetRegion, "i") };
  }

  let matchingFarmers = await User.find(farmerQuery).select("_id name phone location");
  if (!matchingFarmers || matchingFarmers.length === 0) {
    matchingFarmers = await User.find({ role: { $in: ["farmer", "producer"] } }).select("_id name phone location");
  }

  const notifiedFarmerIds = [];

  for (const farmer of matchingFarmers) {
    if (farmer._id.toString() === buyerId.toString()) continue;

    const messageContent = `📢 BULK SOURCING REQUEST: Buyer ${buyerName} is requesting ${quantity} ${unit || "q"} of ${cropType} at ETB ${Number(targetPrice).toLocaleString()}/${unit || "q"} for delivery to ${deliveryRegion}. Notes: ${farmerCriteria?.notes || "No special conditions"}.`;

    await Message.create({
      senderId: buyerId,
      receiverId: farmer._id,
      content: messageContent,
      sourcingRequestData: {
        sourcingRequestId: request._id,
        cropType,
        quantity: Number(quantity),
        unit: unit || "q",
        targetPrice: Number(targetPrice),
        deliveryRegion,
        status: "pending",
      },
    });

    try {
      await Notification.create({
        userId: farmer._id,
        type: "sourcing_request",
        message: `New bulk request for ${quantity} q of ${cropType}`,
        relatedId: request._id.toString(),
        isRead: false,
      });
    } catch (_) {}

    notifiedFarmerIds.push(farmer._id);
  }

  request.notifiedFarmerIds = notifiedFarmerIds;
  await request.save();

  return sendResponse(res, {
    statusCode: 201,
    message: `Bulk sourcing request created successfully. ${notifiedFarmerIds.length} farmers notified in chat!`,
    data: {
      request,
      notifiedCount: notifiedFarmerIds.length,
    },
  });
});

export const getSourcingRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isFarmer = req.user.role === "farmer" || req.user.role === "producer";

  let filter = {};
  if (isFarmer) {
    filter = { status: "active" };
  } else {
    filter = { buyerId: userId };
  }

  const requests = await SourcingRequest.find(filter)
    .sort({ createdAt: -1 })
    .populate("buyerId", "name phone");

  return sendResponse(res, {
    statusCode: 200,
    message: "Sourcing requests retrieved successfully",
    data: { requests },
  });
});

export const respondToSourcingRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const { action, productId } = req.body;
  const farmerId = req.user._id;
  const farmerName = req.user.name || "Farmer";

  const request = await SourcingRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Sourcing request not found");
  }

  request.responses.push({
    farmerId,
    farmerName,
    action: action === "accepted" ? "accepted" : "rejected",
    productId: productId || null,
  });

  if (action === "accepted") {
    request.status = "fulfilled";
  }

  await request.save();

  const responseMsgContent =
    action === "accepted"
      ? `✅ Farmer ${farmerName} ACCEPTED your bulk request for ${request.cropType} (${request.quantity} ${request.unit})! A produce listing has been created.`
      : `❌ Farmer ${farmerName} is currently out of stock for ${request.cropType}.`;

  await Message.create({
    senderId: farmerId,
    receiverId: request.buyerId,
    content: responseMsgContent,
    sourcingRequestData: {
      sourcingRequestId: request._id,
      cropType: request.cropType,
      quantity: request.quantity,
      unit: request.unit,
      targetPrice: request.targetPrice,
      deliveryRegion: request.deliveryRegion,
      status: action === "accepted" ? "accepted" : "rejected",
    },
  });

  await Message.updateMany(
    {
      "sourcingRequestData.sourcingRequestId": request._id,
    },
    {
      $set: {
        "sourcingRequestData.status": action === "accepted" ? "accepted" : "rejected",
      },
    }
  );

  const isAccepted = action === "accepted";
  const fallbackMessage = isAccepted
    ? `Your sourcing request for ${request.cropType} was accepted.`
    : `Your sourcing request for ${request.cropType} was declined.`;
  const messageKey = isAccepted
    ? "notifications.sourcingAccepted"
    : "notifications.sourcingRejected";

  createNotification(
    request.buyerId,
    "sourcing_update",
    fallbackMessage,
    request._id,
    messageKey,
    { cropType: request.cropType }
  );

  return sendResponse(res, {
    statusCode: 200,
    message: `Response recorded: ${action}`,
    data: { request },
  });
});
