import mongoose from "mongoose";

// Dummy model to satisfy Mongoose polymorphic populate (refPath) when targetType is "System"
if (!mongoose.models.System) {
  mongoose.model("System", new mongoose.Schema({}));
}

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      refPath: 'targetType',
    },
    targetType: {
      type: String,
      enum: ["User", "Product", "Order", "System"],
      required: true,
    },
    details: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export const logAction = async (adminId, action, targetId, targetType, details = "") => {
  try {
    await AuditLog.create({
      adminId,
      action,
      targetId,
      targetType,
      details,
    });
  } catch (err) {
    console.error("[AuditLog] Failed to create audit log:", err.message);
  }
};

export default AuditLog;
