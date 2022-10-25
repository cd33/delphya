import { useEffect, useState, createContext } from "react";
import { providers } from "ethers";
import { ReactElement } from "react";

type Context = {
  account: string | null;
  provider: providers.Web3Provider | null;
  setAccount: Function;
  setProvider: Function;
  owner: string;
  recipient: string;
  delphyaAddress: string;
};

const initialContext: Context = {
  account: null,
  provider: null,
  setAccount: (): void => {
    throw new Error("setAccount function must be overridden");
  },
  setProvider: (): void => {
    throw new Error("setProvider not implemented");
  },
  owner: "",
  recipient: "",
  delphyaAddress: "",
};

declare var window: any;

const EthersContext = createContext(initialContext);

export const EthersProvider = (props: { children: ReactElement }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const owner = "0xdB4D6160532835f8Be98f3682eD165D5Ce02ECf9";
  const recipient = "0xD9453F5E2696604703076835496F81c3753C3Bb3";
  const delphyaAddress = "0x33801fECd9181Aaabb85e007e4607a86088a5117"

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      window.ethereum.on("accountsChanged", () => {
        setAccount(null);
        setProvider(new providers.Web3Provider(window.ethereum));
        // window.ethereum.removeAllListeners('accountsChanged')
      });
      // window.ethereum.on("chainChanged", () => {
      //   setAccount(null);
      //   setProvider(new providers.Web3Provider(window.ethereum));
      // });
      window.ethereum.on("disconnect", () => {
        setAccount(null);
        setProvider(new providers.Web3Provider(window.ethereum));
      });
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      setProvider(new providers.Web3Provider(window.ethereum));
    }
  }, []);

  return (
    <EthersContext.Provider
      value={{
        account,
        provider,
        setAccount,
        setProvider,
        owner,
        recipient,
        delphyaAddress
      }}
    >
      {props.children}
    </EthersContext.Provider>
  );
};

export default EthersContext;