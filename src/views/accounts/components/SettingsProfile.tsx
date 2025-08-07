import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicInfo from "./BasicInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import WorkingPortfolio from "./WorkPortifolio";
import Steps from "@/components/ui/Steps";
import { basicInfoSchema } from "@/schemas/BasicInfoSchema";
import { professionalInfoSchema } from "@/schemas/ProfessionalInfoSchema";
import { workingPortfolioSchema } from "@/schemas/WorkingPortifolioSchema";
import { useAuth } from "@/auth";
import { CanceledError } from "axios";
import journalistService from "@/services/journalistService";
import regionService from "@/services/regionService";
import { SelectOption } from "@/@types/selectOption";
import districtService from "@/services/districtService";
import { Region } from "@/@types/region";
import { DistrictForm } from "@/schemas/DistrictSchema";
import expertiseService from "@/services/expertiseService";
import { Expertise } from "@/@types/expertise";
import educationLevelService from "@/services/educationLevelService";
import { EducationLevel } from "@/@types/educationLevel";
import organizationService from "@/services/organizationService";
import { Organization } from "@/@types/organization";
import occupationService from "@/services/occupationService";
import { Occupation } from "@/@types/occupation";

const SettingsProfile: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [districts, setDistricts] = useState<DistrictForm[]>([]);
  const [expertiseList, setExpertiseList] = useState<SelectOption[]>([]);
  const [educationLevelList, setEducationLevelList] = useState<SelectOption[]>(
    []
  );

  const [organisationList, setOrganisationList] = useState<SelectOption[]>([]);
  const [occupationList, setOccupationList] = useState<SelectOption[]>([]);

  // ✅ Fetch Regions on Mount
  useEffect(() => {
    const { request, cancel } = regionService.list<Region>({
      page: 1,
      perPage: 100000,
    });
    console.log(request);
    request
      .then((res) => {
        setRegions(
          res.data.data.map((reg: any) => ({
            label: reg.name,
            value: reg.uuid,
          }))
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error fetching regions:", error);
      });

    return () => cancel();
  }, []);

  // ✅ Fetch Districts when Region is Selected
  useEffect(() => {
    if (selectedRegion) {
      setDistricts([]);
      const { request, cancel } = districtService.list({
        regionUuid: selectedRegion,
      });
      request
        .then((res) => {
          setDistricts(
            res.data.data.map((dist: any) => ({
              label: dist.name,
              value: dist.uuid,
            }))
          );
        })
        .catch((error) => {
          if (error instanceof CanceledError) return;
          console.error("Error fetching districts:", error);
        });

      return () => cancel();
    }
  }, [selectedRegion]);

  // ✅ Fetch Expertise on Mount
  useEffect(() => {
    const { request, cancel } = expertiseService.list<Expertise>({
      page: 1,
      perPage: 100000,
    });
    request
      .then((res) => {
        setExpertiseList(
          res.data.data.map((exp: any) => ({
            label: exp.name,
            value: exp.uuid,
          }))
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error fetching expertise:", error);
      });

    return () => cancel();
  }, []);

  // ✅ Fetch Level on mount

  useEffect(() => {
    const { request, cancel } = educationLevelService.list<EducationLevel>({
      page: 1,
      perPage: 100000,
    });
    request
      .then((res) => {
        setEducationLevelList(
          res.data.data.map((edu: any) => ({
            label: edu.name,
            value: edu.uuid,
          }))
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error fetching education level:", error);
      });

    return () => cancel();
  }, []);

  // ✅ Fetch organisation on mount

  useEffect(() => {
    const { request, cancel } = organizationService.list<Organization>({
      page: 1,
      perPage: 100000,
    });
    request
      .then((res) => {
        setOrganisationList(
          res.data.data.map((edu: any) => ({
            label: edu.name,
            value: edu.uuid,
          }))
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error on organisation", error);
      });

    return () => cancel();
  }, []);

  // ✅ Fetch occupation on mount

  useEffect(() => {
    const { request, cancel } = occupationService.list<Occupation>({
      page: 1,
      perPage: 100000,
    });
    request
      .then((res) => {
        console.log(res.data.data);
        setOccupationList(
          res.data.data.map((edu: any) => ({
            label: edu.name,
            value: edu.uuid,
          }))
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error on organisation", error);
      });

    return () => cancel();
  }, []);

  const methods = useForm({
    resolver: zodResolver(
      currentStep === 1
        ? basicInfoSchema
        : currentStep === 2
          ? professionalInfoSchema
          : workingPortfolioSchema
    ),
    mode: "onSubmit",
    defaultValues: {},
  });
  useEffect(() => {
    if (user?.uuid) {
      getJournalistDetails(user.uuid);
    }
  }, [user?.uuid]);

  const getJournalistDetails = async (uuid: string) => {
    setIsLoading(true);
    try {
      const { request } = journalistService.show(uuid);
      const response = await request;

      if (!response?.data?.data) {
        console.log("api not working perfect");
        return;
      }

      const journalist = response.data.data;
      console.log(journalist);

      // ✅ Pre-fill the form with API data
      methods.reset({
        uuid: journalist.uuid || "",
        firstName: journalist.firstName || "",
        middleName: journalist.middleName || "",
        lastName: journalist.lastName || "",
        email: journalist.email || "",
        phone: journalist.phone || "",
        gender: journalist.gender || "Male",
        dateOfBirth: journalist.birthDate || "",

        region: journalist.region
          ? { label: journalist.region.name, value: journalist.region.uuid }
          : undefined,
        district: journalist.district
          ? { label: journalist.district.name, value: journalist.district.uuid }
          : undefined,

        // ✅ Professional Info
        bio: journalist.bio || "",
        experience: journalist.experience || "",
        eduSchool: journalist.eduSchool || "",
        eduCompletionYear: journalist.eduCompletionYear
          ? String(journalist.eduCompletionYear)
          : "",

        educationLevel: journalist.level
          ? educationLevelList.find(
              (option) => option.value === journalist.level.uuid
            ) || {
              uuid: journalist.level.uuid,
              name: journalist.level.name,
            }
          : null,

        expertise: journalist.expertise || [],
        profilePicUrl: journalist.profilePicUrl || "",

        // ✅ Working Portfolio Fields
        organization: journalist.organization
          ? {
              label: journalist.organization.name,
              value: journalist.organization.uuid,
            }
          : undefined,
        occupation: journalist.occupation
          ? {
              label: journalist.occupation.name,
              value: journalist.occupation.uuid,
            }
          : undefined,

        startDate: journalist.startDate ?? "",
        endDate: journalist.endDate ?? "",
        publishedArticles: journalist.publishedArticles ?? "",

        // ✅ Social Media Links
        linkedinLink: journalist.linkedinLink ?? "",
        twitterLink: journalist.twitterLink ?? "",
        facebookLink: journalist.facebookLink ?? "",
        websiteLink: journalist.websiteLink ?? "",
      });
    } catch (error) {
      console.error("🔥 Error fetching journalist details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <h4 className="mb-4">Complete Your Profile</h4>

      <Steps className="mb-10" current={currentStep}>
        <Steps.Item title="Basic Info" />
        <Steps.Item title="Professional Info" />
        <Steps.Item title="Working Portfolio" />
      </Steps>

      {currentStep === 1 && (
        <BasicInfo regions={regions} onNext={() => setCurrentStep(2)} />
      )}
      {currentStep === 2 && (
        <ProfessionalInfo
          expertiseList={expertiseList}
          educationLevelList={educationLevelList}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
        <WorkingPortfolio
          organisationList={organisationList}
          occupationList={occupationList}
          onNext={() => setCurrentStep(1)}
        />
      )}
    </FormProvider>
  );
};

export default SettingsProfile;
