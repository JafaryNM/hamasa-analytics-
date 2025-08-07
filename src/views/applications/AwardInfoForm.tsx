import { Award } from "@/@types/award";
import { Button } from "@/components/ui";
import { AdaptiveCard } from "@/components/shared";
import ReactHtmlParser from "html-react-parser";
import moment from "moment";
import { HiChartBar, HiDatabase } from "react-icons/hi";
import { CiCircleCheck } from "react-icons/ci";

interface AwardInfoFormProps {
  onNext: () => void;
  onPrev: () => void;
  selectAward: Award | null;
}

const AwardInfoForm = ({ onNext, selectAward, onPrev }: AwardInfoFormProps) => {
  return (
    <AdaptiveCard>
      <input
        className="h3 font-bold outline-none bg-transparent p-4"
        defaultValue={selectAward?.title}
      />

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 px-6">
        <div>
          <div className="mt-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <HiChartBar className="text-blue-400 text-2xl" />
            <span>Award's Name</span>
          </div>
          <div className="flex items-center gap-1 px-3 rounded-xl min-h-[46px]">
            {selectAward?.title}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 px-6">
        <div>
          <div className="mt-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <HiDatabase className="text-blue-400 text-2xl" />
            <span>Starting Date</span>
          </div>
          <div className="flex items-center gap-1 px-3 rounded-xl min-h-[46px]">
            {selectAward?.startDate
              ? moment(selectAward.startDate).format("LL")
              : "N/A"}
          </div>
        </div>

        <div>
          <div className="mt-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <HiDatabase className="text-blue-400 text-2xl" />
            <span>Deadline</span>
          </div>
          <div className="flex items-center gap-1 px-3 rounded-xl min-h-[46px]">
            {selectAward?.endDate
              ? moment(selectAward.endDate).format("LL")
              : "N/A"}
          </div>
        </div>

        <div className="col-span-2">
          <h5 className="mb-2">Description</h5>
          <div className="prose max-w-full cursor-pointer" role="button">
            <div className="prose-p:text-sm prose-p:dark:text-gray-400">
              {ReactHtmlParser(selectAward?.description || "")}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <h5 className="mb-2">Instructions</h5>
          <div className="flex flex-col mt-4 space-y-2">
            {selectAward?.instructions?.map((instruction) => (
              <div
                key={instruction.uuid}
                className="flex items-start space-x-2"
              >
                <CiCircleCheck className="text-blue-400 text-2xl mt-1" />
                <div>{instruction.instruction}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h5 className="mb-2 font-semibold">Assessment Criteria For Awards</h5>
          <div className="flex flex-col mt-4 space-y-4">
            {selectAward?.awardCriterias?.map((item, index) => (
              <div key={item.uuid} className="border p-3 rounded-md bg-gray-50">
                <div className="font-semibold text-sm">
                  {index + 1}. {item.criteria.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Score range: {item.criteria.minScore} -{" "}
                  {item.criteria.maxScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex justify-between mt-4">
          <Button onClick={onPrev}>Previous</Button>
          <Button variant="solid" onClick={onNext}>
            Proceed To Apply 
          </Button>
        </div>
      </div>
    </AdaptiveCard>
  );
};

export default AwardInfoForm;
