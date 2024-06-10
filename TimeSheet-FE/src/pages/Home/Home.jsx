import LogoText from "~/components/common/LogoText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { Button, IconButton, Modal, OutlinedInput } from "@mui/material";
import { Check, X } from "lucide-react";
import TableActivity from "~/components/Home/TableActivity";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createKaryawan } from "~/services/Apis/freelancers";
import RupiahNumber from "~/utils/RupiahNumber";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Select from "react-select";
import { createProyeks, getAllProyeks } from "~/services/Apis/proyeks";
import CombineDateToISO from "~/utils/CombineDateToISO";
import { addActivitiesFreelancer } from "~/services/Apis/freelancersActivities";
import moment from "moment";

const schemaFreelancer = yup.object({
  nama_karyawan: yup.string().min(3, "Nama Karyawan minimal 3 huruf"),
  tarif: yup
    .number("Rate Harus berisi angka")
    .min(1000, "Rate Minimal Rp 1000")
    .transform((_, value) => {
      if (value.includes(".")) {
        return 0;
      }
      return +value.replace(/,/, ".");
    })
    .positive("Pastikan tidak menggunakan titik atau garis")
    .transform((value) => (Number.isNaN(value) ? 0 : value))
});
const schemaProyek = yup.object({
  name_proyek: yup.string().min(3, "Nama Proyek minimal 3 huruf").required("Tidak Boleh Kosong")
});

export default function Home() {
  const {
    register: registerFreelancer,
    handleSubmit: handleFreelancer,
    formState: { errors: errorsFreelancer }
  } = useForm({ resolver: yupResolver(schemaFreelancer) });
  const {
    register: registerProyek,
    handleSubmit: handleProyek,
    formState: { errors: errorsProyek }
  } = useForm({ resolver: yupResolver(schemaProyek) });
  const [selectedTabs, setselectedTabs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFreelancer, setDataFreelancer] = useState({});
  const [optionProyeks, setOptionProyeks] = useState([]);
  const [payloadActivity, setPayloadActivity] = useState({
    judul_kegiatan: "",
    tanggal_mulai: "",
    tanggal_berakhir: "",
    jam_mulai: "",
    jam_berakhir: "",
    proyekId_proyek: ""
  });
  const [modal, setModal] = useState({
    tambah_kegiatan: false,
    tambah_proyek: false
  });
  const [toastModal, setToastModal] = useState(false);

  const handleOpenToast = () => {
    setToastModal(true);

    setTimeout(() => {
      setToastModal(false);
    }, 5000);
  };

  const handleChangeTabs = (event, value) => {
    setselectedTabs(value);
  };

  const handleSubmitFreelancer = async (data) => {
    setIsLoading(true);

    const payload = {
      nama_karyawan: data.nama_karyawan,
      tarif: data.tarif
    };

    const response = await createKaryawan(payload);
    if (response.status <= 400) {
      setDataFreelancer(response.data);
      setselectedTabs(0);
    }

    setIsLoading(false);
  };

  const handleSubmitActivity = async (event) => {
    event.preventDefault();

    if (
      !payloadActivity.judul_kegiatan ||
      !payloadActivity.tanggal_mulai ||
      !payloadActivity.jam_mulai ||
      !payloadActivity.tanggal_berakhir ||
      !payloadActivity.jam_berakhir ||
      !payloadActivity.proyekId_proyek ||
      !dataFreelancer?.freelance?.id_Freelancer
    ) {
      console.log("Terdapat data yang kosong, pastikan cek pengaturan");
      return;
    }

    const payload = {
      judul_kegiatan: payloadActivity.judul_kegiatan,
      tanggal_mulai: CombineDateToISO(payloadActivity.tanggal_mulai, payloadActivity.jam_mulai),
      tanggal_berakhir: CombineDateToISO(payloadActivity.tanggal_berakhir, payloadActivity.jam_berakhir),
      proyekId_proyek: payloadActivity.proyekId_proyek,
      freelancersId_Freelancer: dataFreelancer?.freelance?.id_Freelancer
    };

    if (!moment(payload.tanggal_mulai).isSameOrBefore(payload.tanggal_berakhir)) {
      console.log("Tanggal Mulai  melewati Tanggal Berakhir");
      return;
    }

    const response = await addActivitiesFreelancer(payload);
    if (response.status <= 400) {
      setDataFreelancer((prevDataFreelancer) => ({
        ...prevDataFreelancer,
        kegiatan_freelance: [...prevDataFreelancer.kegiatan_freelance, response.data]
      }));
      handleOpenToast();
      handleCloseModal("tambah_kegiatan");
      setPayloadActivity({
        judul_kegiatan: "",
        tanggal_mulai: "",
        tanggal_berakhir: "",
        jam_mulai: "",
        jam_berakhir: "",
        proyekId_proyek: payloadActivity.proyekId_proyek
      });
    }
  };

  const handleSubmitProyek = async (data) => {
    const payload = {
      name_proyek: data.name_proyek
    };

    const response = await createProyeks(payload);
    if (response.status <= 400) {
      setOptionProyeks(response.data);

      const responseOption = await getAllProyeks();
      if (responseOption.status <= 400) {
        const dataProyek = responseOption.data.map((data) => ({
          value: data.id_proyek,
          label: data.name_proyek
        }));
        setOptionProyeks(dataProyek);
        handleOpenToast();
        handleCloseModal("tambah_proyek");
      }
    }
  };

  const handleChangeActivityPayload = (name, value) => {
    setPayloadActivity((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddActivity = async () => {
    handleModal("tambah_kegiatan");

    const response = await getAllProyeks();
    if (response.status <= 400) {
      const dataProyek = response.data.map((data) => ({
        value: data.id_proyek,
        label: data.name_proyek
      }));
      setOptionProyeks(dataProyek);
    }
  };

  const handleModal = (name) => {
    setModal((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleCloseModal = (name) => {
    setModal((prev) => ({
      ...prev,
      [name]: false
    }));
  };

  const handleAddSelect = ({ innerRef, innerProps, isDisabled, children }) => {
    if (!isDisabled) {
      return (
        <div ref={innerRef} {...innerProps}>
          <button
            className="w-full text-red-500 p-2 mt-1 text-left hover:bg-red-100"
            onClick={() => handleModal("tambah_proyek")}
          >
            + Tambah Proyek
          </button>
          {children}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-200 p-2">
      <div className="w-full p-5 bg-primary-background rounded-sm">
        <LogoText />
      </div>
      <div className="w-full p-5 pb-1 bg-primary-background rounded-sm mt-2">
        <h1 className="text-2xl font-bold">HH Timesheet</h1>
      </div>

      {/* Tabs Menu */}
      <div className="w-full px-8 bg-primary-background rounded-sm">
        <Tabs value={selectedTabs} onChange={handleChangeTabs}>
          <Tab sx={{ fontFamily: "Nunito", fontWeight: 700, textTransform: "capitalize" }} label="Daftar Kegiatan" />
          <Tab sx={{ fontFamily: "Nunito", fontWeight: 700, textTransform: "capitalize" }} label="Pengaturan" />
        </Tabs>
      </div>

      {/* Tab Daftar Kegiatan */}
      <div className="bg-primary-background m-2 rounded-md" role="tabpanel" hidden={selectedTabs !== 0}>
        <div className="flex gap-16 p-5">
          <div className="flex flex-col ">
            <div className="text-gray-500 font-semibold text-xs">Nama Karyawan</div>
            <div className="text-gray-900 -tracking-wider font-medium capitalize">
              {dataFreelancer.freelance?.nama_karyawan ?? "-"}
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="text-gray-500 font-semibold text-xs">Rate</div>
            <div>{dataFreelancer?.freelance?.tarif ? RupiahNumber(dataFreelancer.freelance?.tarif) + "/Jam" : "-"}</div>
          </div>
        </div>
        <hr className="border-t-[3px] border-slate-200"></hr>
        <TableActivity
          freelancer={dataFreelancer.freelance}
          rowsActivity={dataFreelancer.kegiatan_freelance}
          optionProyeks={optionProyeks}
          payloadActivity={payloadActivity}
          modal={modal}
          setDataFreelancer={setDataFreelancer}
          setOptionProyeks={setOptionProyeks}
          setPayloadActivity={setPayloadActivity}
          handleOpenToast={handleOpenToast}
          handleAddSelect={handleAddSelect}
          handleAddActivity={handleAddActivity}
          handleChangeActivityPayload={handleChangeActivityPayload}
        />
      </div>

      {/* Tab Pengaturan */}
      <div role="tabpanel" hidden={selectedTabs !== 1}>
        <div className="w-full h-[calc(100vh-210px)] flex items-center justify-center">
          <div className="bg-primary-background p-5 min-w-80 rounded-md">
            <form onSubmit={handleFreelancer(handleSubmitFreelancer)}>
              <div className="flex flex-col">
                <label className="text-sm text-gray-900 mb-1">Nama Karyawan</label>
                <OutlinedInput
                  {...registerFreelancer("nama_karyawan")}
                  error={errorsFreelancer.nama_karyawan?.message ? true : false}
                />
                <p className="ml-2 text-red-600 text-xs">{errorsFreelancer.nama_karyawan?.message} </p>
              </div>
              <div className="flex flex-col mt-5">
                <div className="text-sm text-gray-900 mb-1">Rate</div>
                <OutlinedInput
                  {...registerFreelancer("tarif")}
                  error={errorsFreelancer.tarif?.message ? true : false}
                  type="number"
                  startAdornment={<div className="text-gray-900">Rp.</div>}
                  endAdornment={<div className="text-gray-500">/Jam</div>}
                />
                <p className="ml-2 text-red-600 text-xs">{errorsFreelancer.tarif?.message}</p>
              </div>
              <div className="w-full mt-5">
                <Button
                  sx={{
                    fontWeight: 700,
                    textTransform: "capitalize",
                    color: "#2775EC"
                  }}
                  className="w-1/2"
                  variant="text"
                >
                  Batalkan
                </Button>
                <Button
                  sx={{
                    fontWeight: 700,
                    textTransform: "capitalize"
                  }}
                  className="w-1/2"
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kegiatan */}
      <Modal
        className={modal.tambah_proyek === true ? "hidden" : ""}
        open={modal.tambah_kegiatan}
        onClose={() => handleCloseModal("tambah_kegiatan")}
      >
        <div className="min-w-[70%] bg-white rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <form onSubmit={handleSubmitActivity}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-base font-semibold">Tambah Kegiatan Baru</div>
              <IconButton onClick={() => handleCloseModal("tambah_kegiatan")}>
                <X className="font-extrabold" size={22} strokeWidth={3} />
              </IconButton>
            </div>
            <hr className="border-t-[3px] border-slate-200"></hr>
            <div className="p-5 flex flex-col">
              <div className="flex gap-5">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </div>
                  <DatePicker
                    format="LL"
                    onChange={(value) => handleChangeActivityPayload("tanggal_mulai", value.format("l"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Tanggal Berakhir <span className="text-red-500">*</span>
                  </div>
                  <DatePicker
                    format="LL"
                    onChange={(value) => handleChangeActivityPayload("tanggal_berakhir", value.format("l"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Jam Mulai <span className="text-red-500">*</span>
                  </div>
                  <TimePicker
                    format="LT"
                    onChange={(value) => handleChangeActivityPayload("jam_mulai", value.format("LT"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Jam Berakhir <span className="text-red-500">*</span>
                  </div>
                  <TimePicker
                    format="LT"
                    onChange={(value) => handleChangeActivityPayload("jam_berakhir", value.format("LT"))}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-5">
                <div className="text-sm text-gray-900 mb-1">
                  Judul Kegiatan <span className="text-red-500">*</span>
                </div>
                <OutlinedInput
                  onChange={(event) => handleChangeActivityPayload("judul_kegiatan", event.target.value)}
                />
              </div>
              <div className="flex flex-col mt-5">
                <div className="text-sm text-gray-900 mb-1">
                  Nama Proyek <span className="text-red-500">*</span>
                </div>
                <Select
                  options={optionProyeks}
                  onChange={(choice) => handleChangeActivityPayload("proyekId_proyek", choice.value)}
                  components={{ Menu: handleAddSelect }}
                />
              </div>
            </div>
            <hr className="border-t-[3px] border-slate-200"></hr>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="ml-auto space-x-5">
                <Button variant="text" color="error" onClick={() => handleCloseModal("tambah_kegiatan")}>
                  Kembali
                </Button>
                <Button variant="contained" color="error" type="submit">
                  Simpan
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal Tambah Proyek */}
      <Modal open={modal.tambah_proyek} onClose={() => handleCloseModal("tambah_proyek")}>
        <form
          className="min-w-[70%] bg-white rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onSubmit={handleProyek(handleSubmitProyek)}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="text-base font-semibold">Tambah Proyek Baru</div>
            <IconButton onClick={() => handleCloseModal("tambah_proyek")}>
              <X className="font-extrabold" size={22} strokeWidth={3} />
            </IconButton>
          </div>
          <hr className="border-t-[3px] border-slate-200"></hr>
          <div className="flex flex-col p-5">
            <div className="text-sm text-gray-900 mb-1">
              Nama Proyek <span className="text-red-500">*</span>
            </div>
            <OutlinedInput
              {...registerProyek("name_proyek")}
              error={errorsProyek.name_proyek?.message ? true : false}
            />
            <p className="ml-2 text-red-600 text-xs">{errorsProyek.name_proyek?.message}</p>
          </div>
          <hr className="border-t-[3px] border-slate-200"></hr>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="ml-auto space-x-5">
              <Button variant="text" color="error" onClick={() => handleCloseModal("tambah_proyek")}>
                Kembali
              </Button>
              <Button variant="contained" color="error" type="submit">
                Simpan
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={toastModal} onClose={() => setToastModal(false)}>
        <div className="w-1/3 p-10 bg-white rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="bg-green-400 rounded-full p-2">
              <Check className="text-white" size={50} />
            </div>
            <div className="text-gray-900 font-extrabold text-lg">Berhasil</div>
            <div className="text-gray-900">Tambah atau Update data baru berhasil</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
