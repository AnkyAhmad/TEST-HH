import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Modal,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import moment from "moment/min/moment-with-locales";
import DurationHours from "~/utils/DurationHours";
import { CirclePlus, Eraser, ListFilter, Search, Trash2, X } from "lucide-react";
import humanizeDuration from "humanize-duration";
import RupiahNumber from "~/utils/RupiahNumber";
import { deleteActivitiesFreelancer, updateActivitiesFreelancer } from "~/services/Apis/freelancersActivities";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Select from "react-select";
import { getAllProyeks } from "~/services/Apis/proyeks";
import CombineDateToISO from "~/utils/CombineDateToISO";

const sxTableCellHead = { fontSize: "12px", fontWeight: "bold", py: 0, border: 1, borderColor: "#E2E8F0" };
const sxTableCellBody = { fontSize: "12px", py: 1, border: 1, borderColor: "#E2E8F0" };

export default function TableActivity({
  freelancer,
  rowsActivity,
  optionProyeks,
  payloadActivity,
  modal,
  setDataFreelancer,
  setOptionProyeks,
  setPayloadActivity,
  handleOpenToast,
  handleAddSelect,
  handleAddActivity,
  handleChangeActivityPayload
}) {
  const [totalData, setTotalData] = useState(null);
  const [rowsData, setrowsData] = useState(rowsActivity);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [setselectedUpdate, setSetselectedUpdate] = useState("");

  const handleDeleteActivity = async (uuid) => {
    const response = await deleteActivitiesFreelancer(uuid);
    if (response.status <= 400) {
      const newRows = rowsActivity.filter((obj) => {
        return obj.id_kegiatan !== uuid;
      });
      setrowsData(newRows);
    }
  };

  const handleUpdateActivity = async (uuid, row) => {
    setModalUpdate(true);

    setPayloadActivity({
      judul_kegiatan: row.judul_kegiatan,
      tanggal_mulai: moment.utc(row.tanggal_mulai),
      tanggal_berakhir: moment.utc(row.tanggal_berakhir),
      jam_mulai: moment.utc(row.tanggal_mulai),
      jam_berakhir: moment.utc(row.tanggal_berakhir),
      proyekId_proyek: row.proyekId_proyek
    });

    setSetselectedUpdate(uuid);

    const response = await getAllProyeks();
    if (response.status <= 400) {
      const dataProyek = response.data.map((data) => ({
        value: data.id_proyek,
        label: data.name_proyek
      }));
      setOptionProyeks(dataProyek);
    }
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();

    if (
      !payloadActivity.judul_kegiatan ||
      !payloadActivity.tanggal_mulai ||
      !payloadActivity.jam_mulai ||
      !payloadActivity.tanggal_berakhir ||
      !payloadActivity.jam_berakhir ||
      !payloadActivity.proyekId_proyek ||
      !freelancer?.id_Freelancer
    ) {
      console.log("Terdapat data yang kosong, pastikan cek pengaturan");
      return;
    }

    let fixTanggal_mulai;
    let fixTanggal_berakhir;
    let fixJam_mulai;
    let fixJam_berakhir;

    if (typeof payloadActivity.tanggal_mulai === "object") {
      fixTanggal_mulai = moment(payloadActivity.tanggal_mulai).format("l");
    } else {
      fixTanggal_mulai = payloadActivity.tanggal_mulai;
    }

    if (typeof payloadActivity.tanggal_berakhir === "object") {
      fixTanggal_berakhir = moment(payloadActivity.tanggal_berakhir).format("l");
    } else {
      fixTanggal_berakhir = payloadActivity.tanggal_berakhir;
    }

    if (typeof payloadActivity.jam_mulai === "object") {
      fixJam_mulai = moment(payloadActivity.jam_mulai).format("LT");
    } else {
      fixJam_mulai = payloadActivity.jam_mulai;
    }

    if (typeof payloadActivity.jam_berakhir === "object") {
      fixJam_berakhir = moment(payloadActivity.jam_berakhir).format("LT");
    } else {
      fixJam_berakhir = payloadActivity.jam_berakhir;
    }

    const payload = {
      judul_kegiatan: payloadActivity.judul_kegiatan,
      tanggal_mulai: CombineDateToISO(fixTanggal_mulai, fixJam_mulai),
      tanggal_berakhir: CombineDateToISO(fixTanggal_berakhir, fixJam_berakhir),
      proyekId_proyek: payloadActivity.proyekId_proyek,
      freelancersId_Freelancer: freelancer?.id_Freelancer
    };

    if (!moment(payload.tanggal_mulai).isSameOrBefore(payload.tanggal_berakhir)) {
      console.log("Tanggal Mulai  melewati Tanggal Berakhir");
      return;
    }

    const response = await updateActivitiesFreelancer(setselectedUpdate, payload);
    if (response.status <= 400) {
      setDataFreelancer((prevDataFreelancer) => ({
        ...prevDataFreelancer,
        kegiatan_freelance: response.data
      }));
      setPayloadActivity({
        judul_kegiatan: "",
        tanggal_mulai: "",
        tanggal_berakhir: "",
        jam_mulai: "",
        jam_berakhir: "",
        proyekId_proyek: payloadActivity.proyekId_proyek
      });

      handleOpenToast();
      setModalUpdate(false);
    }
  };

  useEffect(() => {
    setrowsData(rowsActivity);
  }, [rowsActivity]);

  useEffect(() => {
    const handleTotalData = () => {
      let totalDurationsDisplay = null;
      let durationObj = null;

      const arryDuration = rowsData?.map((row) => {
        const duration = moment.utc(moment(row.tanggal_berakhir).diff(moment(row.tanggal_mulai)));

        return {
          start: row.tanggal_mulai,
          end: row.tanggal_berakhir,
          duration: moment.utc(duration).format("HH:mm")
        };
      });

      const totalDurations = arryDuration?.slice(1).reduce((prev, cur) => {
        return prev.add(cur.duration);
      }, moment.duration(arryDuration[0]?.duration));

      if (totalDurations) {
        const durationMilliseconds = moment.duration(totalDurations).asMilliseconds();
        const humanize = humanizeDuration(durationMilliseconds, { units: ["h", "m"] });

        const durationObject = moment.duration(totalDurations);
        const { hours, days, months, years, minutes } = durationObject._data;
        const totalHours = hours + days * 24 + months * 30 * 24 + years * 365 * 24;
        const totalMinutes = minutes + totalHours * 60;
        const rate = freelancer?.tarif;
        const totalPendapatan = ((totalHours + totalMinutes / 60) * rate).toFixed();

        durationObj = durationObject;
        totalDurationsDisplay = humanize;
        setTotalData({ arryDuration, durationObj, totalDurationsDisplay, totalPendapatan });
      }
    };

    handleTotalData();
  }, [rowsActivity, rowsData, freelancer]);

  return (
    <React.Fragment>
      <div className="p-5">
        <div className="flex justify-between">
          <div className="flex items-start">
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold">Daftar Kegiatan</div>
              <Button
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  p: "6px",
                  color: "#2775EC",
                  borderColor: "#F7F8FB",
                  backgroundColor: "#F0F6FF"
                }}
                variant="outlined"
                startIcon={<CirclePlus size={18} />}
                name="tambah_kegiatan"
                onClick={handleAddActivity}
              >
                Tambah Kegiatan
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <OutlinedInput sx={{ px: 1 }} placeholder="Cari" startAdornment={<Search className="mr-2" />} />
            <IconButton sx={{ border: 1, borderRadius: "4px" }}>
              <ListFilter className="text-red-500" size={40} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...sxTableCellHead, width: "30%" }} align="left">
                  Judul Kegiatan
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Nama Proyek
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Tanggal Mulai
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Tanggal Berakhir
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Waktu Mulai
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Waktu Berakhir
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Durasi
                </TableCell>
                <TableCell sx={{ ...sxTableCellHead }} align="center">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsData?.length <= 0 || !rowsData ? (
                <TableCell sx={{ border: 1, borderColor: "#E2E8F0" }} colSpan={8}>
                  <Stack sx={{ width: "100%" }}>
                    <div className="text-center">Belum Ada Kegiatan</div>
                  </Stack>
                </TableCell>
              ) : (
                <React.Fragment>
                  {rowsData?.map((row) => (
                    <TableRow
                      key={row?.id_kegiatan}
                      sx={{ p: "0px", "&:last-child td, &:last-child th": { border: 1, borderColor: "#E2E8F0" } }}
                    >
                      <TableCell sx={{ ...sxTableCellBody }} align="left">
                        {row?.judul_kegiatan}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {row?.nama_proyek?.name_proyek}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {moment.utc(row?.tanggal_mulai).locale("id").format("ll")}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {moment.utc(row?.tanggal_berakhir).locale("id").format("ll")}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {moment.utc(row?.tanggal_mulai).format("HH:mm")}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {moment.utc(row?.tanggal_berakhir).format("HH:mm")}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        {DurationHours(row?.tanggal_mulai, row?.tanggal_berakhir)}
                      </TableCell>
                      <TableCell sx={{ ...sxTableCellBody }} align="center">
                        <div className="flex">
                          <IconButton onClick={() => handleUpdateActivity(row?.id_kegiatan, row)}>
                            <Eraser className="text-red-500" size={12} />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteActivity(row?.id_kegiatan)}>
                            <Trash2 className="text-red-500" size={12} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex flex-col p-2 text-primary-blue bg-slate-100 text-sm">
          <div className="flex justify-between">
            <div>Total Durasi</div>
            <div>{totalData?.totalDurationsDisplay ?? "-"}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-semibold">Total Pendapatan</div>
            <div>{totalData?.totalPendapatan ? RupiahNumber(totalData?.totalPendapatan) : "-"}</div>
          </div>
        </div>
      </div>

      {/* Update Activity */}
      <Modal
        className={modal.tambah_proyek === true ? "hidden" : ""}
        open={modalUpdate}
        onClose={() => setModalUpdate(false)}
      >
        <div className="min-w-[70%] bg-white rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <form onSubmit={handleSubmitUpdate}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-base font-semibold">Tambah Kegiatan Baru</div>
              <IconButton onClick={() => setModalUpdate(false)}>
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
                    defaultValue={payloadActivity.tanggal_mulai}
                    format="LL"
                    onChange={(value) => handleChangeActivityPayload("tanggal_mulai", value.format("l"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Tanggal Berakhir <span className="text-red-500">*</span>
                  </div>
                  <DatePicker
                    defaultValue={payloadActivity.tanggal_berakhir}
                    format="LL"
                    onChange={(value) => handleChangeActivityPayload("tanggal_berakhir", value.format("l"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Jam Mulai <span className="text-red-500">*</span>
                  </div>
                  <TimePicker
                    defaultValue={payloadActivity.jam_mulai}
                    format="LT"
                    onChange={(value) => handleChangeActivityPayload("jam_mulai", value.format("LT"))}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-gray-900 mb-1">
                    Jam Berakhir <span className="text-red-500">*</span>
                  </div>
                  <TimePicker
                    defaultValue={payloadActivity.jam_berakhir}
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
                  defaultValue={payloadActivity.judul_kegiatan}
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
                <Button variant="text" color="error" onClick={() => setModalUpdate(false)}>
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
    </React.Fragment>
  );
}
