import { useEffect, useState } from "react";

import AttendanceHeader from "../components/attendance/AttendanceHeader";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceForm from "../components/attendance/AttendanceForm";
import AttendanceFilter from "../components/attendance/AttendanceFilter";

import Modal from "../components/common/Modal";
import Pagination from "../components/common/Pagination";

import useAttendance from "../hooks/useAttendance";
import { getMembers } from "../services/memberService";

function Attendance() {
  // ========================================
  // ATTENDANCE API
  // ========================================

  const {
    attendance,
    loading,
    error,
    addAttendance,
    updateAttendance,
  } = useAttendance();

  // ========================================
  // MEMBERS
  // ========================================

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState("");

  // ========================================
  // FORM / DELETE STATES
  // ========================================

  const [saving, setSaving] = useState(false);

  // ========================================
  // SEARCH
  // ========================================

  const [search, setSearch] = useState("");

  // ========================================
  // DATE FILTER
  // ========================================

  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ========================================
  // STATUS FILTER
  // ========================================

  const [status, setStatus] = useState("All");

  // ========================================
  // PAGINATION
  // ========================================

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // ========================================
  // CHECK-IN MODAL
  // ========================================

  const [
    showCheckInModal,
    setShowCheckInModal,
  ] = useState(false);

  // ========================================
  // LOAD MEMBERS
  // ========================================

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setMembersLoading(true);
        setMembersError("");

        const data = await getMembers();

        setMembers(data);
      } catch (error) {
        console.error(
          "Failed to fetch members:",
          error
        );

        setMembersError(
          error.message || "Failed to load members"
        );
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ========================================
  // OPEN CHECK-IN
  // ========================================

  const handleCheckIn = () => {
    setShowCheckInModal(true);
  };

  // ========================================
  // CLOSE CHECK-IN
  // ========================================

  const handleCloseCheckIn = () => {
    if (saving) return;

    setShowCheckInModal(false);
  };

  // ========================================
  // SAVE CHECK-IN
  // ========================================

  const handleSaveCheckIn = async (
    attendanceData
  ) => {
    try {
      setSaving(true);

      /*
       * AttendanceForm currently uses:
       *
       * memberId
       * date
       * checkIn
       * checkOut
       * status
       *
       * PostgreSQL API expects:
       *
       * member_id
       * attendance_date
       * check_in
       * check_out
       * status
       */

      const apiData = {
        member_id: Number(attendanceData.memberId),

        attendance_date:
          attendanceData.date || null,

        check_in:
          attendanceData.checkIn || null,

        check_out:
          attendanceData.checkOut || null,

        status:
          attendanceData.status || "Present",
      };

      await addAttendance(apiData);

      setCurrentPage(1);
      setShowCheckInModal(false);
    } catch (error) {
      console.error(
        "Failed to save attendance:",
        error
      );

      // Hook already stores the error.
      // Keep modal open so user can correct the form.
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // CHECK-OUT
  // ========================================

  const handleCheckOut = async (attendanceId) => {
    try {
      setSaving(true);

      const record = attendance.find(
        (item) => item.id === attendanceId
      );

      if (!record) {
        return;
      }

      // Already checked out
      if (record.check_out) {
        return;
      }

      const now = new Date();

      const checkOutTime =
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

      const apiData = {
        member_id: Number(record.member_id),

        attendance_date:
          record.attendance_date,

        check_in:
          record.check_in || null,

        check_out:
          checkOutTime,

        status:
          record.status || "Present",
      };

      await updateAttendance(
        attendanceId,
        apiData
      );
    } catch (error) {
      console.error(
        "Failed to check out member:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const handleResetFilters = () => {
    setSearch("");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
    setStatus("All");
    setCurrentPage(1);
  };

// ========================================
// CONVERT API DATA TO UI FORMAT
// ========================================

const attendanceForUI = attendance.map((record) => ({
  id: record.id,

  memberId: record.member_id,
  memberName: record.member_name || "",
  memberPhone: record.member_phone || "",

  date: record.attendance_date || "",

  checkIn: record.check_in || "",
  checkOut: record.check_out || "",

  status: record.status || "Present",
}));





  // ========================================
  // FILTER ATTENDANCE
  // ========================================

 const filteredAttendance =
  attendanceForUI.filter((record) => {
      // ------------------------------------
      // SEARCH
      // ------------------------------------

      const searchValue =
        search.trim().toLowerCase();

      const memberName =
        record.member_name || "";

      const memberPhone =
        record.member_phone || "";

      const memberId =
        record.member_id ?? "";

      const matchesSearch =
        !searchValue ||
        memberName
          .toLowerCase()
          .includes(searchValue) ||
        memberPhone
          .toLowerCase()
          .includes(searchValue) ||
        String(memberId)
          .toLowerCase()
          .includes(searchValue);

      // ------------------------------------
      // DATE
      // ------------------------------------

      let matchesDate = true;

      const attendanceDate =
        record.attendance_date;

      if (dateFilter === "today") {
        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        matchesDate =
          attendanceDate === today;
      }

      if (dateFilter === "specific") {
        matchesDate =
          !startDate ||
          attendanceDate === startDate;
      }

      if (dateFilter === "range") {
        const afterStart =
          !startDate ||
          attendanceDate >= startDate;

        const beforeEnd =
          !endDate ||
          attendanceDate <= endDate;

        matchesDate =
          afterStart && beforeEnd;
      }

      // ------------------------------------
      // STATUS
      // ------------------------------------

      const matchesStatus =
        status === "All" ||
        record.status === status;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    });

  // ========================================
  // PAGINATION
  // ========================================

  const totalPages = Math.ceil(
    filteredAttendance.length /
      recordsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    recordsPerPage;

  const paginatedAttendance =
    filteredAttendance.slice(
      startIndex,
      startIndex + recordsPerPage
    );

  // ========================================
  // RETURN
  // ========================================

  return (
    <div>
      {/* ==================================
          HEADER
      ================================== */}

      <AttendanceHeader
        onCheckIn={handleCheckIn}
      />

      {/* ==================================
          ERROR
      ================================== */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {membersError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {membersError}
        </div>
      )}

      {/* ==================================
          LOADING
      ================================== */}

      {loading && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-blue-700">
          Loading attendance...
        </div>
      )}

      {/* ==================================
          STATISTICS
      ================================== */}

      <AttendanceStats
        attendance={filteredAttendance}
      />

      {/* ==================================
          FILTERS
      ================================== */}

      <AttendanceFilter
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        setDateFilter={(value) => {
          setDateFilter(value);
          setCurrentPage(1);
        }}
        startDate={startDate}
        setStartDate={(value) => {
          setStartDate(value);
          setCurrentPage(1);
        }}
        endDate={endDate}
        setEndDate={(value) => {
          setEndDate(value);
          setCurrentPage(1);
        }}
        status={status}
        setStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        total={filteredAttendance.length}
      />

      {/* ==================================
          ATTENDANCE TABLE
      ================================== */}

      <AttendanceTable
        attendance={paginatedAttendance}
        onCheckOut={handleCheckOut}
        loading={saving}
      />

      {/* ==================================
          PAGINATION
      ================================== */}

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ==================================
          CHECK-IN MODAL
      ================================== */}

      <Modal
        isOpen={showCheckInModal}
        title="Member Check In"
        onClose={handleCloseCheckIn}
      >
        {membersLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading members...
          </div>
        ) : (
          <AttendanceForm
            members={members}
            attendance={attendance}
            onSave={handleSaveCheckIn}
            loading={saving}
          />
        )}
      </Modal>
    </div>
  );
}

export default Attendance;