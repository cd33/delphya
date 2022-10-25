import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import useEthersProvider from "../context/useEthersProvider";
import { ethers } from "ethers";
import Delphya from "../../artifacts/contracts/Delphya.sol/Delphya.json";
import { toast } from "react-toastify";
import { Blocks } from "react-loader-spinner";
import Hide from "../components/Hide";

const Home: NextPage = () => {
  const { account, provider, owner, delphyaAddress } = useEthersProvider();
  const [balanceETH, setBalanceETH] = useState<string>("")
  const [balanceBAY, setBalanceBAY] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [counterMint, setCounterMint] = useState<number>(0);
  const [basketETH, setBasketETH] = useState<number>(0);

  const [predictionId, setPredictionId] = useState<number>(0)
  const [prediction, setPrediction] = useState<boolean>(false)
  const [amountBet, setAmountBet] = useState<number>(0)

  const [predictionIdRewards, setPredictionIdRewards] = useState<number>(0)

  // ADMIN
  const [description, setDescription] = useState<string>("");
  const [dateLimit, setDateLimit] = useState<number>(0);
  const [predictionIdAdmin, setPredictionIdAdmin] = useState<number>(0);
  const [result, setResult] = useState<boolean>(true);

  const getDatas = useCallback(async () => {
    setIsLoading(true);
    if (provider && account && delphyaAddress != "") {
      try {
        const contract = new ethers.Contract(
          delphyaAddress,
          Delphya.abi,
          provider
        );
        const salePrice = await contract.salePrice();
        setSalePrice(parseInt(salePrice));
        setBalanceETH(ethers.utils.formatEther(await provider.getBalance(account)))
        setBalanceBAY(ethers.utils.formatEther(await contract.balanceOf(account)))
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  }, [account, provider, delphyaAddress]);

  console.log('balanceETH :>> ', balanceETH);
  console.log('balanceBAY :>> ', balanceBAY);
  useEffect(() => {
    if (account) {
      getDatas();
    }
  }, [account, getDatas]);

  useEffect(() => {
    if (account && provider && counterMint && salePrice)
      setBasketETH(counterMint / salePrice);
  }, [account, provider, counterMint, salePrice]);

  async function mint(_amount: number) {
    if (account && provider && basketETH) {
      setIsLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(delphyaAddress, Delphya.abi, signer);

      try {
        let overrides = {
          from: account,
          value: ethers.utils.parseEther(basketETH.toString()),
        };
        const transaction = await contract.mint(
          account,
          ethers.utils.parseEther(_amount.toString()),
          overrides
        );
        await transaction.wait();
        setIsLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error("Error mint, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        } else {
          console.log(String(error));
          toast.error("Error mint, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        }
        setIsLoading(false);
      }
    }
  }

  async function betPrediction(
    _predictionId: number,
    _prediction: boolean,
    _amountBet: number
  ) {
    if (provider) {
      setIsLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(delphyaAddress, Delphya.abi, signer);

      try {
        let overrides = {
          from: account,
        };
        const transaction = await contract.betPrediction(
          _predictionId,
          _prediction,
          ethers.utils.parseEther(_amountBet.toString()),
          overrides
        );
        await transaction.wait();
        setIsLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error("Error betPrediction, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        } else {
          console.log(String(error));
          toast.error("Error betPrediction, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        }
        setIsLoading(false);
      }
    }
  }

  async function claimRewards(_predictionId: number) {
    if (provider) {
      setIsLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(delphyaAddress, Delphya.abi, signer);

      try {
        let overrides = {
          from: account,
        };
        const transaction = await contract.claimRewards(
          _predictionId,
          overrides
        );
        await transaction.wait();
        setIsLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error("Error claimRewards, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        } else {
          console.log(String(error));
          toast.error("Error claimRewards, more informations on the console", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        }
        setIsLoading(false);
      }
    }
  }

  // ADMIN
  async function createPrediction(_description: string, _dateLimit: number) {
    if (provider) {
      setIsLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(delphyaAddress, Delphya.abi, signer);

      try {
        let overrides = {
          from: account,
        };
        const transaction = await contract.createPrediction(
          _description,
          _dateLimit,
          overrides
        );
        await transaction.wait();
        setIsLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error(
            "Error createPrediction, more informations on the console",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "dark",
            }
          );
        } else {
          console.log(String(error));
          toast.error(
            "Error createPrediction, more informations on the console",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "dark",
            }
          );
        }
        setIsLoading(false);
      }
    }
  }

  async function resultPrediction(_predictionId: number, _result: boolean) {
    if (provider) {
      setIsLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(delphyaAddress, Delphya.abi, signer);

      try {
        let overrides = {
          from: account,
        };
        const transaction = await contract.resultPrediction(
          _predictionId,
          _result,
          overrides
        );
        await transaction.wait();
        setIsLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error(
            "Error resultPrediction, more informations on the console",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "dark",
            }
          );
        } else {
          console.log(String(error));
          toast.error(
            "Error resultPrediction, more informations on the console",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "dark",
            }
          );
        }
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="home">
      <Head>
        <title>Delphya</title>
        <meta name="Delphya" content="Delphya" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!account || !provider ? <Hide /> : ""}
      {isLoading ? (
        <Blocks
          visible={true}
          height="30"
          width="30"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      ) : (
        <>
        <p>MY BALANCE ETH : {balanceETH}</p>
        <p>MY BALANCE BAY : {balanceBAY}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "5vh",
              marginTop: "5vh",
            }}
          >
            <p style={{ marginRight: "2vw" }}>BUY BAY</p>
            <input
              placeholder="Mint Bay"
              onChange={(e) => setCounterMint(parseInt(e.target.value))}
              style={{ marginRight: "2vw" }}
            />
            <p style={{ alignSelf: "center", marginRight: "2vw" }}>
              Price : {basketETH} ETH
            </p>
            <button
              onClick={() => mint(counterMint)}
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Loading..." : "MINT"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "5vh",
              marginTop: "5vh",
            }}
          >
            <p style={{ marginRight: "2vw" }}>Bet Prediction</p>
            <input
              placeholder="ID Prediction"
              onChange={(e) => setPredictionId(parseInt(e.target.value))}
              style={{ marginRight: "2vw" }}
            />
            <select
              onChange={(e) =>
                setPrediction(e.target.value === "true" ? true : false)
              }
              style={{ marginRight: "2vw" }}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
            <input
              placeholder="Amount Bet"
              onChange={(e) => setAmountBet(parseInt(e.target.value))}
              style={{ marginRight: "2vw" }}
            />

            <button
              onClick={() => betPrediction(predictionId, prediction, amountBet)}
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Loading..." : "BET"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "5vh",
              marginTop: "5vh",
            }}
          >
            <p style={{ marginRight: "2vw" }}>Claim Rewards</p>
            <input
              placeholder="ID Prediction"
              onChange={(e) => setPredictionIdRewards(parseInt(e.target.value))}
              style={{ marginRight: "2vw" }}
            />

            <button
              onClick={() => claimRewards(predictionIdRewards)}
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Loading..." : "CLAIM"}
            </button>
          </div>

          {account && owner === account && (
            <>
              <p>ADMIN</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "10vh",
                  zIndex: 1,
                }}
              >
                <p style={{ marginRight: "2vw" }}>Create Prediction</p>
                <input
                  placeholder="Description Prediction"
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ marginRight: "2vw" }}
                />
                <input
                  placeholder="Date Limit Prediction"
                  onChange={(e) => setDateLimit(parseInt(e.target.value))}
                  style={{ marginRight: "2vw" }}
                />
                <button
                  style={{ marginLeft: "2vw" }}
                  onClick={() => createPrediction(description, dateLimit)}
                  disabled={isLoading ? true : false}
                >
                  {isLoading ? "Loading..." : "CREATE"}
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "10vh",
                  zIndex: 1,
                }}
              >
                <p style={{ marginRight: "2vw" }}>Result Prediction</p>
                <input
                  placeholder="ID Prediction"
                  onChange={(e) =>
                    setPredictionIdAdmin(parseInt(e.target.value))
                  }
                  style={{ marginRight: "2vw" }}
                />
                <select
                  onChange={(e) =>
                    setResult(e.target.value === "true" ? true : false)
                  }
                  style={{ marginRight: "2vw" }}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
                <button
                  style={{ marginLeft: "2vw" }}
                  onClick={() => resultPrediction(predictionIdAdmin, result)}
                  disabled={isLoading ? true : false}
                >
                  {isLoading ? "Loading..." : "RESULT"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
