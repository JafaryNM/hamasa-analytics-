import { Award } from "@/@types/award";
import { AwardCategory } from "@/@types/awardCategory";
import { AwardRound } from "@/@types/awardRound";
import Tabs from "@/components/ui/Tabs";
import awardService from "@/services/awardService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TabsValue } from "../../components/ui/Tabs/context";
import AllApplications from "./evaluation-components/AllApplications";
import ScreeningApplications from "./evaluation-components/ScreeningApplications";
import RoundApplications from "./evaluation-components/RoundApplications";
import { RoundScore } from "@/@types/roundScore";

const { TabNav, TabList, TabContent } = Tabs;

const AwardEvaluations = () => {
  const { uuid } = useParams();
  console.log(uuid);

  const [award, setAward] = useState<Award>();
  const [rounds, setRounds] = useState<AwardRound[]>([]);
  const [awardCategories, setAwardCategories] = useState<AwardCategory[]>([]);
  const [isLoadingAward, setIsLoadingAward] = useState(false);
  const [currentRound, setCurrentRound] = useState<RoundScore | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("screening");

  useEffect(() => {
    getAwardDetails();
  }, []);

  const getAwardDetails = () => {
    setIsLoadingAward(true);
    const { request } = awardService.show(uuid ?? "");

    request
      .then((res) => {
        if (res.data.data != null) {
          const result = res.data.data;
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

          if (result.rounds != null) {
            const round = result.rounds.filter(
              (round: AwardRound) => round.isCurrent
            )[0];

            onTabChange(round != null ? round.uuid : "screening");

            setCurrentRound(round);

            // console.log(currentRound);
          }

          setRounds(result.rounds);

          setAwardCategories(result.awardCategories);
          setIsLoadingAward(false);
        }
      })
      .catch((error) => {
        // if (error instanceof CanceledError) return;
        console.log(error);
        setIsLoadingAward(false);
      });
  };

  useEffect(() => {
    onTabChange(currentTab ?? "");
  }, [currentRound]);

  const onTabChange = (tabsValue: TabsValue) => {
    const tab = tabsValue ?? "";
    console.log(tabsValue);
    setCurrentTab(tabsValue);
  };

  return (
    <div>
      <Tabs defaultValue={currentTab} variant="pill" onChange={onTabChange}>
        <TabList>
          <TabNav value="all">All</TabNav>
          <TabNav value="screening">Screening</TabNav>
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
          <TabContent value="screening">
            <ScreeningApplications
              awardUuid={uuid}
              reloadPage={getAwardDetails}
              currentRound={currentRound}
            />
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

export default AwardEvaluations;
