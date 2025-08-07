import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Loading from "@/components/shared/Loading";
import ProfileSection from "./ProfileSection";
import BillingSection from "./BillingSection";
import ActivitySection from "./LogSection";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import type { Customer } from "./types";
import adminService from "@/services/authUserService";
import { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { Admin } from "@/@types/Results";
import userService from "@/services/userService";
import { UserLog } from "@/@types/userLog";

const { TabNav, TabList, TabContent } = Tabs;

const AdminDetails = () => {
  const { uuid } = useParams();

  const [record, setRecord] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const data: Customer = {
  //   id: "1",
  //   name: "Angelina Gotelli",
  //   firstName: "Angelina",
  //   lastName: "Gotelli",
  //   email: "carolyn_h@hotmail.com",
  //   img: "/img/avatars/thumb-1.jpg",
  //   role: "admin",
  //   lastOnline: 1723430400,
  //   status: "active",
  //   // title: 'Product Manager',
  //   orderHistory: [
  //     {
  //       id: "#36223",
  //       item: "Acme pro plan (monthly)",
  //       status: "pending",
  //       amount: 59.9,
  //       date: 1739132800,
  //     },
  //     {
  //       id: "#34283",
  //       item: "Acme pro plan (monthly)",
  //       status: "paid",
  //       amount: 59.9,
  //       date: 1736790880,
  //     },
  //     {
  //       id: "#32234",
  //       item: "Acme pro plan (monthly)",
  //       status: "paid",
  //       amount: 59.9,
  //       date: 1734090880,
  //     },
  //   ],
  //   paymentMethod: [
  //     {
  //       cardHolderName: "Angelina Gotelli",
  //       cardType: "VISA",
  //       expMonth: "12",
  //       expYear: "25",
  //       last4Number: "0392",
  //       primary: true,
  //     },
  //     {
  //       cardHolderName: "Angelina Gotelli",
  //       cardType: "MASTER",
  //       expMonth: "06",
  //       expYear: "25",
  //       last4Number: "8461",
  //       primary: false,
  //     },
  //   ],
  //   subscription: [
  //     {
  //       plan: "Business board basic",
  //       status: "active",
  //       billing: "monthly",
  //       nextPaymentDate: 1739132800,
  //       amount: 59.9,
  //     },
  //   ],
  //   totalSpending: 4367.15,
  //   personalInfo: {
  //     location: "Tokyo, JP",
  //     address: "456 Tokyo Blvd",
  //     postcode: "123-4567",
  //     city: "Tokyo",
  //     country: "JP",
  //     dialCode: "+81",
  //     birthday: "03/02/1984",
  //     phoneNumber: "+12-123-1234",
  //     facebook: "facebook.com",
  //     twitter: "twitter.com",
  //     pinterest: "pinterest.com",
  //     linkedIn: "linkedin",
  //     title: "",
  //   },
  // };

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

export default AdminDetails;
