import { expect } from "chai";
import { ethers } from "hardhat";
import { Delphya } from "../typechain-types/contracts/Delphya";

const salePrice = ethers.utils.parseUnits("1");

describe("Delphya", function () {
  let token: Delphya;

  before(async function () {
    [this.owner, this.investor, this.toto] = await ethers.getSigners();
    const Delphya = await ethers.getContractFactory("Delphya");
    token = await Delphya.deploy();
  });

  describe("Deploy Verification", function () {
    it("Should get balance of owner", async function () {
      expect((await token.balanceOf(this.owner.address)).toString()).to.equal(
        ethers.utils.parseUnits("1000000")
      );
    });
  });

  describe("Mint", function () {
    it("Should mint X tokens", async function () {
      let tx = await token
        .connect(this.investor)
        .mint(this.investor.address, ethers.utils.parseEther("1000000"), {
          value: ethers.utils.parseEther("1"),
        });
      await tx.wait();
      expect(
        (await token.balanceOf(this.investor.address)).toString()
      ).to.equal(ethers.utils.parseEther("1000000"));
    });
  });

  describe("createPrediction", function () {
    it("Should createPrediction if owner of the smart contract", async function () {
      await expect(token.createPrediction("toto", 1666707677))
        .to.emit(token, "PredictionCreated")
        .withArgs(1, "toto", 1666707677);
    });

    it("Should NOT createPrediction if NOT owner of the smart contract", async function () {
      await expect(
        token
          .connect(this.investor)
          .createPrediction(
            this.investor.address,
            ethers.utils.parseUnits("1000000")
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Global Test", function () {
    it("mint, createPrediction, betPrediction, resultPrediction, claimRewards", async function () {
      // Owner et Investor mint
      await token.mint(this.owner.address, ethers.utils.parseEther("1000000"), {
        value: ethers.utils.parseEther("1"),
      });
      await token
        .connect(this.investor)
        .mint(this.investor.address, ethers.utils.parseEther("1000000"), {
          value: ethers.utils.parseEther("1"),
        });

      // Création de la prédiction
      await token.createPrediction("toto est il vrai ?", 1666707677);

      // Owner et Investor font une prédiction, 1 bon 1 mauvais
      await token.betPrediction(1, false, ethers.utils.parseEther("100"));
      await token
        .connect(this.investor)
        .betPrediction(1, true, ethers.utils.parseEther("200"));

      expect(await token.balanceOf(token.address)).to.equal(
        ethers.utils.parseEther("300")
      );

      expect((await token.getBet(1, 1)).user).to.equal(this.owner.address);
      expect((await token.getBet(1, 2)).user).to.equal(this.investor.address);

      // resultPrediction
      await token.resultPrediction(1, true);
      expect((await token.predictions(1)).didItHappened).to.equal(true);
      expect((await token.predictions(1)).claimable).to.equal(true);
      expect((await token.predictions(1)).totalAmountBets).to.equal(
        ethers.utils.parseEther("300")
      );
      expect((await token.predictions(1)).totalAmountBetsWinners).to.equal(
        ethers.utils.parseEther("200")
      );

      // claimRewards
      await expect(token.claimRewards(1)).to.be.revertedWith("No rewards");
      await expect(token.connect(this.investor).claimRewards(1))
        .to.emit(token, "Transfer")
        .withArgs(token.address, this.investor.address, ethers.utils.parseEther("300"));
    });
  });
});
