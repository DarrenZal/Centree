import { ethers, providers } from "ethers";
import React, { FC, useState } from "react";
import { Thunk } from "state";
import { setCTRPrice } from "state/buy";
import { OnStatusHandler } from "./utils";
import Centree from "@klimadao/lib/abi/Centree.json";
import { formatUnits } from "@klimadao/lib/utils";
import { addresses, Bond } from "@klimadao/lib/constants";
import { getDefaultProvider } from "@ethersproject/providers";

export const buyCTR = async (params: {
  value: string;
  address: string;
  provider: providers.JsonRpcProvider;
  onStatus: OnStatusHandler;
}) => {
  try {
    //const provider = await getDefaultProvider("ropsten");
    const contractAddress = "0xA20F2a67E14843b76f8Ab1eaAE50058e5747fD70";
    const contract = new ethers.Contract(
      "0xA20F2a67E14843b76f8Ab1eaAE50058e5747fD70",
      Centree.abi,
      params.provider.getSigner()
    );
    params.onStatus("userConfirmation", "");
    const txn = await contract.buyCTR(params.address, {
      gasPrice: ethers.utils.parseUnits("100", "gwei"),
      gasLimit: "99000",
      value: params.value,
    });
    params.onStatus("networkConfirmation", "");
    await txn.wait(1);
    params.onStatus("done", "Bought CTR successfully");
  } catch (error: any) {
    if (error.code === 4001) {
      params.onStatus("error", "userRejected");
      throw error;
    }
    params.onStatus("error");
    throw error;
  }
};
