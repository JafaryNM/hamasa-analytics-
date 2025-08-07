import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/auth";
import {
  BasicApplicationInfoData,
  BasicApplicationInfoSchema,
} from "@/schemas/BasicApplicationInfoSchema";
import { CollaboratorInfoSchema } from "@/schemas/CollaboratorInfoSchema";
import awardService from "@/services/awardService";
import mediaChannelService from "@/services/mediaChannelService";
import { Award } from "@/@types/award";
import { SelectOption } from "@/@types/selectOption";
import { CanceledError } from "axios";
import Steps from "@/components/ui/Steps";
import AwardsListForm from "./AwardsListForm";
import AwardInfoForm from "./AwardInfoForm";
import BasicApplicationFormInfo from "./BasicApplicatinFormInfo";
import MediaInfo from "./MediaInfo";
import CollaboratorFormInfo from "./CollaboratorFormInfo";
import applicationService from "@/services/applicationService";
import { useParams } from "react-router-dom";

const ApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [awardList, setAwardList] = useState<Award[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [selectAward, setSelectedAward] = useState<Award | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [mediaChannelList, setMediaChannelList] = useState<SelectOption[]>([]);
  const [basicInfoPrefilled, setBasicInfoPrefilled] = useState<
    Partial<BasicApplicationInfoData>
  >({});
  const [prefilledAward, setPrefilledAward] = useState<Award | null>(null);
  const [loadingAwards, setLoadingAwards] = useState(true);

  const { uuid } = useParams();

  const handleIsGroupChange = (value: boolean) => {
    setIsGroup(value);
  };

  const updateFormData = (newData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    if (!uuid) return;

    const { request, cancel } = applicationService.show(uuid);

    request
      .then((res) => {
        const data = res.data.data;

        updateFormData(data);
        setIsGroup(data.isGroup);

        const prefilledData = {
          title: data.title || "",
          description: data.description || "",
          isGroup: data.isGroup ? "true" : "false",
          publishedDate: data.publishedDate
            ? new Date(data.publishedDate)
            : null,
          awardCategoryUuid: data.awardCategory?.uuid || "",
        };

        setBasicInfoPrefilled(prefilledData);
        setPrefilledAward(data.award || null);

        let step = 3;
        if (data.isGroup && data.currentStage === "collaborator") {
          step = 4;
        } else if (!data.isGroup && data.currentStage === "mediaInfo") {
          step = 4;
        } else if (data.isGroup && data.currentStage === "mediaInfo") {
          step = 5;
        }

        setCurrentStep(step);
      })
      .catch((err) => {
        console.error("Error resuming application:", err);
      });

    return () => cancel();
  }, [uuid]);

  useEffect(() => {
    const { request, cancel } = awardService.list<Award>(
      { page: 1, perPage: 100000 },
      "/published"
    );

    setLoadingAwards(true);

    request
      .then((res) => {
        setAwardList(res.data.data || []);
      })
      .catch((err) => {
        if (!(err instanceof CanceledError)) {
          console.error("Error fetching awards:", err);
        }
      })
      .finally(() => {
        setLoadingAwards(false);
      });

    return () => cancel();
  }, []);

  useEffect(() => {
    const { request, cancel } = mediaChannelService.list<SelectOption>({
      page: 1,
      perPage: 100000,
    });

    request
      .then((res) => {
        setMediaChannelList(
          res.data.data.map((item: any) => ({
            label: item.name,
            value: item.uuid,
          }))
        );
      })
      .catch((err) => {
        if (!(err instanceof CanceledError)) {
          console.error("Error fetching media channels:", err);
        }
      });

    return () => cancel();
  }, []);

  const steps = [
    { title: "Cohorts" },
    { title: "Cohort Information" },
    { title: "Application Submittion" },
    ...(isGroup ? [{ title: "Collaborator Information" }] : []),
    // { title: "Media Submission" },
  ];

  const methods = useForm<BasicApplicationInfoData>({
    resolver: zodResolver(
      currentStep === 4 && isGroup
        ? CollaboratorInfoSchema
        : BasicApplicationInfoSchema
    ),
    mode: "onSubmit",
    defaultValues: {},
  });

  const handleNext = () => {
    if (currentStep === 3 && !isGroup) {
      setCurrentStep(4); // Media directly
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1));

  const isFinalStep = () => {
    return (!isGroup && currentStep === 4) || (isGroup && currentStep === 5);
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto p-8 mb-4 bg-white shadow-lg rounded-lg">
        <h4 className="text-2xl font-bold mb-6 text-left">
          Dear {user.firstName}, You are About to Start Your Application
        </h4>

        <Steps className="mb-10" current={currentStep}>
          {steps.map((step, index) => (
            <Steps.Item key={index} title={step.title} />
          ))}
        </Steps>

        {currentStep === 1 && (
          <AwardsListForm
            onNext={handleNext}
            awardList={awardList}
            setSelectedAward={setSelectedAward}
            loading={loadingAwards}
          />
        )}

        {currentStep === 2 && (
          <AwardInfoForm
            onNext={handleNext}
            onPrev={handlePrev}
            selectAward={selectAward}
          />
        )}

        {currentStep === 3 && (
          <BasicApplicationFormInfo
            prefilledData={basicInfoPrefilled}
            prefilledAward={prefilledAward}
            onNext={handleNext}
            onPrev={handlePrev}
            selectAward={selectAward}
            onIsGroupChange={handleIsGroupChange}
            updateFormData={updateFormData}
            isGroup={isGroup}
            formData={formData}
          />
        )}

        {/* {isGroup && currentStep === 4 && (
          <CollaboratorFormInfo
            onNext={handleNext}
            onPrev={handlePrev}
            updateFormData={updateFormData}
            formData={formData}
          />
        )} */}

        {/* {isFinalStep() && (
          <MediaInfo
            onPrev={handlePrev}
            onUpdateFormData={updateFormData}
            formData={formData}
            MediaList={mediaChannelList}
            isGroup={isGroup}
          />
        )} */}
      </div>
    </FormProvider>
  );
};

export default ApplicationForm;
