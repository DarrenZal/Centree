import { Link } from "react-router-dom";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { providers } from "ethers";
import { selectNotificationStatus } from "state/selectors";
import { setAppState, AppNotificationStatus, TxnStatus } from "state/app";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import classNames from "classnames";
import T from "@klimadao/lib/theme/typography.module.css";

import {
  changeApprovalTransaction,
  changeStakeTransaction,
} from "actions/stake";
import { useAppDispatch } from "state";
import { incrementStake, decrementStake, setStakeAllowance } from "state/user";
import {
  selectAppState,
  selectBalances,
  selectStakeAllowance,
} from "state/selectors";

import {
  Spinner,
  TextInfoTooltip,
  useTooltipSingleton,
} from "@klimadao/lib/components";
import {
  secondsUntilBlock,
  trimWithPlaceholder,
  concatAddress,
} from "@klimadao/lib/utils";
import t from "@klimadao/lib/theme/typography.module.css";
import styles from "./index.module.css";
import { Trans } from "@lingui/macro";
import { prettifySeconds } from "lib/i18n";

const WithPlaceholder: FC<{
  condition: boolean;
  placeholder: string;
}> = (props) => {
  if (props.condition) {
    return <>{props.placeholder}</>;
  }
  return <>{props.children}</>;
};

interface Props {
  provider: providers.JsonRpcProvider;
  address?: string;
  isConnected: boolean;
}

export const Conserve = (props: Props) => {
  const { provider, address, isConnected } = props;
  const dispatch = useAppDispatch();
  const [view, setView] = useState("conserve");
  const fullStatus: AppNotificationStatus | null = useSelector(
    selectNotificationStatus
  );
  const status = fullStatus && fullStatus.statusType;

  const setStatus = (statusType: TxnStatus | null, message?: string) => {
    if (!statusType) return dispatch(setAppState({ notificationStatus: null }));
    dispatch(setAppState({ notificationStatus: { statusType, message } }));
  };

  const [quantity, setQuantity] = useState("");
  const [singletonSource, singleton] = useTooltipSingleton();

  const {
    fiveDayRate,
    currentIndex,
    stakingRebase,
    stakingAPY,
    currentBlock,
    rebaseBlock,
    locale,
  } = useSelector(selectAppState);

  const stakeAllowance = useSelector(selectStakeAllowance);
  const balances = useSelector(selectBalances);

  const isLoading =
    !stakeAllowance || typeof stakeAllowance.klima === "undefined";

  const nextRebasePercent = stakingRebase && stakingRebase * 100;
  const fiveDayRatePercent = fiveDayRate && fiveDayRate * 100;
  const stakingAPYPercent = stakingAPY && stakingAPY * 100;
  const nextRebaseValue =
    stakingRebase &&
    balances?.sklima &&
    stakingRebase * Number(balances.sklima);

  const setMax = () => {
    setStatus(null);
    if (view === "stake") {
      setQuantity(balances?.klima ?? "0");
    } else {
      setQuantity(balances?.sklima ?? "0");
    }
  };

  const handleApproval = (action: "stake" | "unstake") => async () => {
    try {
      const value = await changeApprovalTransaction({
        provider,
        action,
        onStatus: setStatus,
      });
      if (action === "stake") {
        dispatch(setStakeAllowance({ klima: value }));
      } else {
        dispatch(setStakeAllowance({ sklima: value }));
      }
    } catch (e) {
      return;
    }
  };

  const handleStake = (action: "stake" | "unstake") => async () => {
    try {
      const value = quantity.toString();
      setQuantity("");
      await changeStakeTransaction({
        value,
        provider,
        action,
        onStatus: setStatus,
      });
      dispatch(
        action === "stake" ? incrementStake(value) : decrementStake(value)
      );
    } catch (e) {
      return;
    }
  };

  const hasApproval = (action: "stake" | "unstake") => {
    if (action === "stake")
      return stakeAllowance && !!Number(stakeAllowance.klima);
    if (action === "unstake")
      return stakeAllowance && !!Number(stakeAllowance.sklima);
  };

  const timeUntilRebase = () => {
    if (currentBlock && rebaseBlock && locale) {
      const seconds = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  };

  const getButtonProps = () => {
    const value = Number(quantity || "0");
    if (!isConnected || !address) {
      return {
        children: <Trans id="button.not_connected">Not connected</Trans>,
        onClick: undefined,
        disabled: true,
      };
    } else if (isLoading) {
      return {
        children: <Trans id="button.loading">Loading</Trans>,
        onClick: undefined,
        disabled: true,
      };
    } else if (
      status === "userConfirmation" ||
      status === "networkConfirmation"
    ) {
      return {
        children: <Trans id="button.confirming">Confirming</Trans>,
        onClick: undefined,
        disabled: true,
      };
    } else if (view === "stake" && !hasApproval("stake")) {
      return {
        children: <Trans id="button.approve">Approve</Trans>,
        onClick: handleApproval("stake"),
      };
    } else if (view === "unstake" && !hasApproval("unstake")) {
      return {
        children: <Trans id="button.approve">Approve</Trans>,
        onClick: handleApproval("unstake"),
      };
    } else if (view === "stake" && hasApproval("stake")) {
      return {
        children: <Trans id="button.stake">Stake</Trans>,
        onClick: handleStake("stake"),
        disabled: !balances?.klima || !value || value > Number(balances.klima),
      };
    } else if (view === "unstake" && hasApproval("unstake")) {
      return {
        children: <Trans id="button.unstake">Unstake</Trans>,
        onClick: handleStake("unstake"),
        disabled:
          !balances?.sklima || !value || value > Number(balances.sklima),
      };
    } else {
      return { children: "ERROR", onClick: undefined, disabled: true };
    }
  };

  const showSpinner =
    isConnected &&
    (status === "userConfirmation" ||
      status === "networkConfirmation" ||
      isLoading);

  return (
    <div className={styles.conserveCard}>
      <div className={styles.conserveCard_header}>
        <h2 className={t.h4}>Conserve & Regenerate.</h2>
        <p className={t.body2}>
          Purchase CTR and vote to conserve forests<br/>
          Funds from NFTs go towards conservation and regeneration<br/>
          A Stewardship Tenure is granted to the NFT owner <br/>
          NFT owner delgates maintenence to Stewards on the Land <br/>
          The NFT represents the holistic value of the forests
        </p>
      </div>
      <Link to="buy" key="buyKey">
            <div className={styles.bondLink} key="buy CTR key">
              <div>
                <h3 className="this classname">Buy CTR</h3>
                <p
                  className="test classname"
                >
                </p>
              </div>
            </div>
          </Link>
          <Link to="vote" key="voteKey">
            <div className={styles.bondLink} key="vote key">
            <div>
                <h3 className={T.subtitle2}>Vote to Conserve</h3>
                <p
                  className={classNames(styles.bondLink_description, T.caption)}
                >
                  {"Use CTR to vote on forests to conserve"}
                </p>
              </div>
            </div>
          </Link>
      <div className={styles.inputsContainer}>
      
      </div>

      
    </div>
  );
};
