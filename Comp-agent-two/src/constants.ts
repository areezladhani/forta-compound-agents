// the comptroller contract is where all the pause functionality is
export const COMPTROLLER_CONTRACT =
  "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

/// @notice Emitted when pause guardian is changed
// only admin can set a new pause guardian
export const NEW_PAUSE_GUARDIAN =
  "event NewPauseGuardian(address oldPauseGuardian, address newPauseGuardian)";

/// @notice Emitted when an action is paused globally
// only pause guardian and admin can pause
export const ACTION_PAUSED_GLOBAL =
  "event ActionPaused(string action, bool pauseState)";

/// @notice Emitted when an action is paused on a market
// only pause guardian and admin can pause
export const ACTION_PAUSED_MARKET =
  "event ActionPaused(address cToken, string action, bool pauseState)";
