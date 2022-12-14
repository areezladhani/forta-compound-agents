// Once a proposal is created and passes voting it will be queued for twoo days, at his time users can get their funds out of the
// the protocol if they disagree with the new changes
export const PROPOSAL_QUEUED = "event ProposalQueued (uint256 id, uint256 eta)";
export const GOVERNANCE_CONTRACT = "0xc0Da02939E1441F497fd74F78cE7Decb17B66529";

export const PROPOSAL_CREATED =
  "event ProposalCreated (uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)";

export const VOTE_CAST_EVENT =
  "event VoteCast (address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason)";
