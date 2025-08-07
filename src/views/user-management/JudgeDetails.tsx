import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Loading from "@/components/shared/Loading";
import ProfileSection from "./ProfileSection";
import ActivitySection from "./LogSection";
import { useParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { Admin } from "@/@types/Results";
import userService from "@/services/userService";

const { TabNav, TabList, TabContent } = Tabs;

const JudgeDetails = () => {
  const { uuid } = useParams();

  const [record, setRecord] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRecordDetails();
  }, []);

  const getRecordDetails = () => {
    setIsLoading(true);
    const { request, cancel } = userService.show(uuid ?? "");

    request
      .then((res) => {
        if (res.data.data != null) {
          const result = res.data.data as Admin;
          setRecord({
            uuid: result.uuid,
            firstName: result.firstName,
            lastName: result.lastName,
            type: result.type,
            gender: result.gender,
            phone: result.phone,
            email: result.email,
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

  return (
    <Loading loading={isLoading}>
      {!isEmpty(record) && (
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="min-w-[330px] 2xl:min-w-[400px]">
            <ProfileSection data={record} reloadFunc={getRecordDetails} />
          </div>
          <Card className="w-full">
            <Tabs defaultValue="activity">
              <TabList>
                {/* <TabNav value="billing">Billing</TabNav> */}
                <TabNav value="activity">Activity</TabNav>
              </TabList>
              <div className="p-4">
                {/* <TabContent value="billing">
                  <BillingSection data={data} />
                </TabContent> */}
                <TabContent value="activity">
                  <ActivitySection uuid={uuid as string} />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      )}
    </Loading>
  );
};

export default JudgeDetails;
