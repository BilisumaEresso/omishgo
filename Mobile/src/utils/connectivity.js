import NetInfo from "@react-native-community/netinfo";

/**
 * One-off connectivity check. Treats "unknown" as online so we don't
 * block actions on a platform quirk — API calls will fail on their own
 * and route the user into the offline/draft path anyway.
 */
export async function isConnected() {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected !== false;
  } catch {
    return true;
  }
}

/**
 * Subscribe to connectivity changes. Returns an unsubscribe function.
 * @param {(online: boolean) => void} callback
 */
export function subscribeToConnectivity(callback) {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected !== false);
  });
}

export default { isConnected, subscribeToConnectivity };
