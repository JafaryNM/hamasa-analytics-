import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Container } from "@/components/shared";
import { TbClipboardCheck } from "react-icons/tb";
import { AwardData } from "@/schemas/AwardSchema";
import { Award } from "@/@types/award";
import Alert from "@/components/ui/Alert";

type Props = {
  onNext: () => void;
  awardList: Award[];
  setSelectedAward: Dispatch<SetStateAction<Award | null>>;
  loading: boolean;
};

const AwardsListForm = ({
  onNext,
  awardList,
  setSelectedAward,
  loading,
}: Props) => {
  const {
    formState: { errors },
  } = useFormContext<AwardData>();

  const onSelectAward = (award: Award) => {
    setSelectedAward(award);
    onNext();
  };

  return (
    <Container>
      <h4 className="mb-4 text-lg font-semibold">Cohort Information</h4>

      {loading ? (
        <div className="text-gray-500 text-center py-10">
          Loading cohorts...
        </div>
      ) : awardList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awardList.map((award) => (
            <div
              key={award.uuid}
              className="cursor-pointer rounded-xl bg-gray-100 dark:bg-gray-700 p-6 group hover:bg-primary transition-colors"
              onClick={() => onSelectAward(award)}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full p-4 bg-neutral group-hover:bg-white/25 transition-colors">
                  <span className="text-2xl text-primary group-hover:text-neutral transition-colors">
                    <TbClipboardCheck />
                  </span>
                </div>
                <h4 className="font-bold mt-2 text-base group-hover:text-white transition-colors">
                  {award.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors max-w-[250px] min-h-[50px]">
                  {award.description.length > 80
                    ? award.description.substring(0, 80) + "..."
                    : award.description}
                </p>
                <div className="font-semibold text-sm text-primary group-hover:text-white transition-colors">
                  Start Date: {award.startDate}
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 text-black rounded-md font-semibold transition-colors group-hover:text-white"
                >
                  Read & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Alert showIcon type="danger" title="No Active Awards">
          There are currently no published awards available. Please check back
          later.
        </Alert>
      )}
    </Container>
  );
};

export default AwardsListForm;
