import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Loading from "@/components/shared/Loading";
// import { apiGetCustomerLog } from '@/services/CustomersService'
import sleep from "@/utils/sleep";
import isEmpty from "lodash/isEmpty";
import useUserLogs from "@/hooks/useUserLogs";
import moment from "moment";
import { UserLog } from "@/@types/userLog";
import { GroupedData } from "@/@types/GroupedData";
import { LogDetail } from "@/@types/logDetail";
import { Pagination } from "@/components/ui";

const getLogDetails = (logType: string): LogDetail => {
  switch (logType) {
    case "CREATED":
      return {
        title: "Created Record",
        description: "A new record has been successfully created.",
      };

    case "UPDATED":
      return {
        title: "Updated Record",
        description: "An existing record has been updated.",
      };

    case "VIEWED_LIST":
      return {
        title: "Viewed List",
        description: "A list of records has been viewed.",
      };

    case "VIEWED_ITEM":
      return {
        title: "Viewed Item",
        description: "A specific item was viewed in detail.",
      };

    case "DELETED":
      return {
        title: "Deleted Record",
        description: "A record has been permanently deleted.",
      };

    case "VIEWED_REPORT":
      return {
        title: "Viewed Report",
        description: "A report was accessed and viewed.",
      };

    case "LOGGED_IN":
      return {
        title: "User Logged In",
        description: "A user has successfully logged into the system.",
      };

    case "LOGGED_OUT":
      return {
        title: "User Logged Out",
        description: "A user has logged out of the system.",
      };

    case "PENDINF": // Assuming you meant "PENDING"
      return {
        title: "Pending Approval",
        description: "A request is awaiting approval.",
      };

    case "APPROVED_STAGE":
      return {
        title: "Stage Approved",
        description: "A stage in the process has been approved.",
      };

    case "REJECTED_STAGE":
      return {
        title: "Stage Rejected",
        description: "A stage in the process has been rejected.",
      };

    default:
      return {
        title: "Unknown Log Type",
        description: "No details available for this log type.",
      };
  }
};

const TimeLineContent = (props: { type: string; module: string }) => {
  const { type, module } = props;
  const { title, description } = getLogDetails(type);
  return (
    <div>
      <h6 className="font-bold">
        {title} - {module}
      </h6>
      <p className="font-semibold">{description}</p>
    </div>
  );
};

const LogSection = ({ uuid }: { uuid: string }) => {
  const customerName = "hgggccg";
  const [records, setRecords] = useState<GroupedData<UserLog>>({});
  // const { data } =

  const { data, isLoading, pagination, setPagination } = useUserLogs(
    uuid ?? ""
  );

  useEffect(() => {
    // setRecords(groupByDate(data));
    const results = groupByDate(data);

    setRecords(results);

    console.log(results);
  }, [data]);

  const groupByDate = (items: UserLog[]) => {
    return items.reduce<GroupedData<UserLog>>((acc, item) => {
      const createdAt = moment(item?.createdAt).format("DD MMM, YYYY");
      if (!acc[createdAt]) {
        acc[createdAt] = [];
      }
      acc[createdAt].push(item);
      return acc;
    }, {});
  };

  const onPaginationChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className="">
      <Loading loading={isLoading}>
        {Object.entries(records).map(([date, items]) => (
          // data &&
          //   data.map((log) => (
          <div key={date} className="mb-4">
            <div className="mb-4 font-bold uppercase flex items-center gap-4">
              <span className="w-[70px] heading-text">
                {moment(date).format("DD MMM")}
              </span>
              <div className="border-b border-2 border-gray-200 dark:border-gray-600 border-dashed w-full"></div>
            </div>
            <div className="flex flex-col gap-4">
              {isEmpty(items) ? (
                <div>No Activities</div>
              ) : (
                items.map((item, index) => (
                  <div key={item.event + index} className="flex items-center">
                    <span className="font-semibold w-[100px]">
                      {moment(item?.createdAt).format("h:mm A")}
                    </span>
                    <Card className="max-w-[600px] w-full" bodyClass="py-3">
                      <div className="flex items-center gap-4">
                        {/* <div className="text-primary text-3xl">
                        <TimeLineMedia type={item.event} />
                      </div> */}
                        <TimeLineContent
                          type={item.event}
                          module={item.module}
                        />
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </Loading>

      {!isLoading && data.length === 0 ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "60vh" }}
        >
          <p>No data is available</p>
        </div>
      ) : (
        ""
      )}
      <Pagination
        className="flex justify-end mt-10"
        onChange={onPaginationChange}
      />
    </div>
  );
};

export default LogSection;
