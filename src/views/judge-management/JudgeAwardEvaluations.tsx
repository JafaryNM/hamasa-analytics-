import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { Award } from "@/@types/award";
import { AwardRound } from "@/@types/awardRound";
import { RoundScore } from "@/@types/roundScore";
import awardService from "@/services/awardService";

import Tabs from "@/components/ui/Tabs";
import AllApplications from "../award-management/evaluation-components/AllApplications";
import RoundApplications from "../award-management/evaluation-components/RoundApplications";
import { TabsValue } from "@/components/ui/Tabs/context";

const { TabNav, TabList, TabContent } = Tabs;

const JudgeAwardEvaluations = () => {
  const { uuid } = useParams();
  console.log("award uuid", uuid);

  const [award, setAward] = useState<Award>();
  const [rounds, setRounds] = useState<AwardRound[]>([]);
  const [currentRound, setCurrentRound] = useState<RoundScore | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("all");

  useEffect(() => {
    getAwardDetails();
  }, []);

  const getAwardDetails = () => {
    const { request } = awardService.show(uuid ?? "");

    request
      .then((res) => {
        const result = res.data.data;
        if (!result) return;

        setAward({
          uuid: result.uuid,
          title: result.title,
          description: result.description,
          startDate: result.startDate,
          endDate: result.endDate,
          judgeAccessStartDate: result.judgeAccessStartDate,
          judgeAccessEndDate: result.judgeAccessEndDate,
          instructions: result.instructions,
          isPublished: result.isPublished,
          isActive: result.isActive,
          createdAt: result.createdAt,
        });

        const current = result.rounds?.find((r: AwardRound) => r.isCurrent);
        setCurrentRound(current ?? null);
        setRounds(result.rounds ?? []);
        setCurrentTab(current?.uuid ?? "all");
      })
      .catch((err) => {
        console.error("Error loading award details:", err);
      });
  };

  const onTabChange = (tabsValue: TabsValue) => {
    setCurrentTab(tabsValue ?? "all");
  };

  return (
    <div>
      <Tabs defaultValue={currentTab} variant="pill" onChange={onTabChange}>
        <TabList>
          <TabNav value="all">All Applications</TabNav>
          {rounds.map((round) => (
            <TabNav key={round.uuid} value={round.uuid}>
              {round.name}
            </TabNav>
          ))}
        </TabList>

        <div className="p-4">
          <TabContent value="all">
            <AllApplications awardUuid={uuid} />
          </TabContent>

          {rounds.map((round) => (
            <TabContent key={round.uuid} value={round.uuid}>
              <RoundApplications
                awardUuid={uuid}
                awardRoundUuid={round.uuid}
                currentRound={currentRound}
              />
            </TabContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default JudgeAwardEvaluations;
