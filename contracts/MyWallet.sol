pragma solidity ^0.5.0;

import "./mortal.sol";
import "./owned.sol";

contract MyWallet is mortal {
    event ReceivedFunds(address _from, uint256 _amount);
    event ProposalReceived(address indexed _from, address indexed _to, string _reason);


    // if msg sender is not the owner
    struct Proposal {
        address _from;
        address payable _to;
        uint256 _value;
        string _reason;
        bool sent;
    }

    uint proposal_counter;

    mapping(uint => Proposal) m_proposals;

    // sending funds to somewhere else + reason
    // what is memory again?
    function spendMoneyOn(address payable _to, uint256 _value, string memory _reason) public returns (uint256) {
        if(owner == msg.sender) {
            /**
             * Update From Solidtiy 0.4.13, where .transfer was introduced!
             * Checkout https://vomtom.at/exception-handling-in-solidity/
             * .send() as shown in the video is depricated.
             **/
            _to.transfer(_value);
        } else {
            proposal_counter++;
            // proposal counter is the ID
            m_proposals[proposal_counter] = Proposal(msg.sender, _to, _value, _reason, false);
            emit ProposalReceived(msg.sender, _to, _reason);
            return proposal_counter;
        }
    }

    function confirmProposal(uint proposal_id) public onlyowner returns (bool) {
        if(m_proposals[proposal_id]._from != address(0)) {
            if(m_proposals[proposal_id].sent != true) {
                m_proposals[proposal_id].sent = true;
                m_proposals[proposal_id]._to.transfer(m_proposals[proposal_id]._value);
                return true;
            }
        }
        return false;
    }

    function() external payable {
        if(msg.value > 0) {
            emit ReceivedFunds(msg.sender, msg.value);
        }
    }
}