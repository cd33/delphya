// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Delphya
/// @author cd33
contract Delphya is ERC20, Ownable {
    address private constant recipient =
        // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // 2nd wallet hardhat
        0xD9453F5E2696604703076835496F81c3753C3Bb3; // my second wallet test

    uint256 public constant maxSupply = 21e6 * 10**18;

    uint256 public constant salePrice = 1e6; // 1 ether = 1e6 BAY

    uint256 public nextPrediction;

    struct Bet {
        address user;
        bool prediction;
        bool rewardAlreadyClaimed;
        uint256 amountBet;
    }

    struct User {
        string nickName;
    }

    struct Prediction {
        bool didItHappened;
        bool claimable; // Pour laisser le temps au owner d'utiliser resultPrediction
        string description;
        uint256 dateLimit;
        uint256 nextBet;
        uint256 totalAmountBets;
        uint256 totalAmountBetsWinners;
        mapping(uint256 => Bet) bets;
    }

    mapping(address => User) public users;
    mapping(uint256 => Prediction) public predictions;

    /// @notice event emitted when a prediction has been created.
    event PredictionCreated(
        uint256 predictionId,
        string description,
        uint256 dateLimit
    );

    constructor() ERC20("Delphya", "BAY") {
        _mint(msg.sender, 1e24);
    }

    /**
     * @notice Enables only externally owned accounts (= users) to mint.
     */
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Caller is a contract");
        _;
    }

    function mint(address _to, uint256 _amount) external payable callerIsUser {
        require(totalSupply() + _amount <= maxSupply, "Sold Out");
        require(msg.value >= _amount / salePrice, "Not enough funds");
        payable(recipient).transfer(address(this).balance);
        _mint(_to, _amount);
    }

    function createPrediction(string calldata _description, uint256 _dateLimit)
        external
        onlyOwner
    {
        nextPrediction++;
        predictions[nextPrediction].description = _description;
        predictions[nextPrediction].dateLimit = _dateLimit;
        emit PredictionCreated(nextPrediction, _description, _dateLimit);
    }

    function createProfil(string calldata _nickname) external {
        users[msg.sender].nickName = _nickname;
    }

    function betPrediction(
        uint256 _predictionId,
        bool _prediction,
        uint256 _amountBet
    ) external {
        transfer(address(this), _amountBet);

        Prediction storage prediction = predictions[_predictionId];
        prediction.nextBet++;
        Bet memory bet = Bet(msg.sender, _prediction, false, _amountBet);
        prediction.bets[prediction.nextBet] = bet;
        prediction.totalAmountBets += _amountBet;
    }

    function resultPrediction(uint256 _predictionId, bool _result)
        external
        onlyOwner
    {
        require(
            predictions[_predictionId].dateLimit <= block.timestamp,
            "DateLimit not done"
        );
        Prediction storage prediction = predictions[_predictionId];
        prediction.didItHappened = _result;
        uint256 totalBetsWinners = 0;
        for (uint256 i = 1; i <= prediction.nextBet; i++) {
            if (prediction.bets[i].prediction == _result) {
                totalBetsWinners += prediction.bets[i].amountBet;
            }
        }
        prediction.totalAmountBetsWinners = totalBetsWinners;
        prediction.claimable = true;
    }

    function claimRewards(uint256 _predictionId) external callerIsUser {
        Prediction storage prediction = predictions[_predictionId];
        require(prediction.claimable, "Prediction not done");
        uint256 totalRewards = 0;
        for (uint256 i = 1; i <= prediction.nextBet; i++) {
            if (
                prediction.bets[i].user == msg.sender &&
                prediction.bets[i].prediction == prediction.didItHappened
            ) {
                if (!prediction.bets[i].rewardAlreadyClaimed) {
                    prediction.bets[i].rewardAlreadyClaimed = true;
                    totalRewards +=
                        (prediction.bets[i].amountBet /
                            prediction.totalAmountBetsWinners) *
                        prediction.totalAmountBets;
                }
            }
        }
        require(totalRewards > 0, "No rewards");
        this.transfer(msg.sender, totalRewards);
    }

    function getBet(uint256 _predictionId, uint256 _betId)
        external
        view
        returns (Bet memory)
    {
        return predictions[_predictionId].bets[_betId];
    }

    /**
     * @notice Not allowing receiving ether outside minting functions
     */
    receive() external payable {
        revert("Only if you mint");
    }
}
