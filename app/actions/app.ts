import { ethers, providers } from "ethers";
import { getDefaultProvider } from "@ethersproject/providers";

import { Thunk } from "state";
import { setAppState } from "state/app";

import { getTreasuryBalance } from "@klimadao/lib/utils";
import { addresses, ESTIMATED_DAILY_REBASES } from "@klimadao/lib/constants";
import DistributorContractv4 from "@klimadao/lib/abi/DistributorContractv4.json";
import SKlima from "@klimadao/lib/abi/sKlima.json";
import IERC20 from "@klimadao/lib/abi/IERC20.json";
import Centree from "@klimadao/lib/abi/Centree.json";

export const loadAppDetails = (params: { onRPCError: () => void }): Thunk => {
  return async (dispatch) => {
    try {
      //alert("start");
      const provider = await getDefaultProvider("ropsten");
      const CentreeContract = new ethers.Contract(
        "0x57E99cBB69FBBd90d671f5EaBddc984D2402836E",
        Centree.abi,
        provider
      );
      const promises = [
        CentreeContract.ctr_price(),
        CentreeContract.projects_fund_amount(1),
      ];
      const [ctrPrice, fairycreekfundsraised] = await Promise.all(promises);

      dispatch(
        setAppState({
          ctrPrice: ctrPrice.toNumber(),
          fairycreekfundsraised: fairycreekfundsraised.toNumber(),
        })
      );
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("Non-200 status code")) {
        params.onRPCError();
      }
    }
  };
};
export const setLocale = (locale: string): Thunk => {
  return (dispatch) => {
    dispatch(
      setAppState({
        locale,
      })
    );
  };
};
