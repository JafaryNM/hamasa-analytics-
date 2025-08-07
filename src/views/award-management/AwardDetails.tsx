import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Loading from "@/components/shared/Loading";
import { useParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { Admin } from "@/@types/Results";
import awardService from "@/services/awardService";
import { Award } from "@/@types/award";
import AwardInfoSection from "./detail-components/AwardInfoSection";
import AwardInstructions from "./detail-components/AwardInstructionSection";
import AwardCategoriesSection from "./detail-components/AwardCategoriesSection";
import AwardCriteriasSection from "./detail-components/AwardCriteriasSection";
import AwardJudgesSection from "./detail-components/AwardJudgesSection";
import AwardRoundsSection from "./detail-components/AwardRoundsSection";

const { TabNav, TabList, TabContent } = Tabs;

const AwardDetails = () => {
  const { uuid } = useParams();

  const [record, setRecord] = useState<Award | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRecordDetails();
  }, []);

  const getRecordDetails = () => {
    setIsLoading(true);
    const { request, cancel } = awardService.show(uuid ?? "");

    request
      .then((res) => {
        if (res.data.data != null) {
          const result = res.data.data as Award;
          setRecord({
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
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  // const getLogs = () => {
  //   setIsLoading(true);
  //   const { request, cancel } = logService.listByItem(uuid ?? "");

  //   request
  //     .then((res) => {
  //       if (res.data.data != null) {
  //         const result = res.data.data;
  //         console.log(result);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       if (error instanceof CanceledError) return;
  //       console.log(error);
  //     });
  // };

  return (
    <Loading loading={isLoading}>
      {!isEmpty(record) && (
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="min-w-[330px] 2xl:min-w-[400px]">
            <AwardInfoSection
              data={record}
              reloadFunc={getRecordDetails}
              uuid={uuid}
            />
          </div>
          <Card className="w-full">
            <Tabs defaultValue="instructions">
              <TabList>
                <TabNav value="instructions">Instructions</TabNav>
                <TabNav value="categories">Categories</TabNav>
                <TabNav value="criterias">Criteria</TabNav>
                <TabNav value="judges">Judges</TabNav>
                <TabNav value="rounds">Rounds</TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="instructions">
                  <AwardInstructions uuid={uuid as string} />
                </TabContent>

                <TabContent value="categories">
                  <AwardCategoriesSection uuid={uuid as string} />
                </TabContent>

                <TabContent value="criterias">
                  <AwardCriteriasSection uuid={uuid as string} />
                </TabContent>

                <TabContent value="judges">
                  <AwardJudgesSection uuid={uuid as string} />
                </TabContent>

                <TabContent value="rounds">
                  <AwardRoundsSection uuid={uuid as string} />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      )}
    </Loading>
  );
};

export default AwardDetails;
