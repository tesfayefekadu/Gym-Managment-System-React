import { useState } from "react";

import AttendanceHeader from "../components/attendance/AttendanceHeader";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceForm from "../components/attendance/AttendanceForm";
import AttendanceFilter from "../components/attendance/AttendanceFilter";

import Modal from "../components/common/Modal";
import Pagination from "../components/common/Pagination";

function Attendance() {
  // ==========================
  // Members
  // ==========================

  const [members] = useState([
    {
      id: 1,
      name: "Tesfaye",
      phone: "0911223344",
      status: "Active",
    },
    {
      id: 2,
      name: "Abel",
      phone: "0912334455",
      status: "Active",
    },
    {
      id: 3,
      name: "John",
      phone: "0913445566",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael",
      phone: "0914556677",
      status: "Active",
    },
  ]);

  // ==========================
  // Attendance Data
  // ==========================

  const [attendance, setAttendance] =
    useState([
      {
        id: 1,
        memberId: 1,
        memberName: "Tesfaye",
        memberPhone: "0911223344",
        date: "2026-08-14",
        checkIn: "08:30",
        checkOut: "10:15",
        status: "Present",
      },
      {
        id: 2,
        memberId: 2,
        memberName: "Abel",
        memberPhone: "0912334455",
        date: "2026-08-14",
        checkIn: "09:15",
        checkOut: "11:00",
        status: "Present",
      },
      {
        id: 3,
        memberId: 3,
        memberName: "John",
        memberPhone: "0913445566",
        date: "2026-08-14",
        checkIn: "17:30",
        checkOut: "",
        status: "Present",
      },
      {
        id: 4,
        memberId: 4,
        memberName: "Michael",
        memberPhone: "0914556677",
        date: "2026-08-13",
        checkIn: "",
        checkOut: "",
        status: "Absent",
      },
      {
        id: 5,
        memberId: 1,
        memberName: "Tesfaye",
        memberPhone: "0911223344",
        date: "2026-08-12",
        checkIn: "08:45",
        checkOut: "10:30",
        status: "Present",
      },
      {
        id: 6,
        memberId: 2,
        memberName: "Abel",
        memberPhone: "0912334455",
        date: "2026-08-11",
        checkIn: "09:00",
        checkOut: "10:45",
        status: "Present",
      },
      {
        id: 7,
        memberId: 3,
        memberName: "John",
        memberPhone: "0913445566",
        date: "2026-08-10",
        checkIn: "09:35",
        checkOut: "11:00",
        status: "Late",
      },
      {
        id: 8,
        memberId: 4,
        memberName: "Michael",
        memberPhone: "0914556677",
        date: "2026-08-09",
        checkIn: "08:20",
        checkOut: "10:00",
        status: "Present",
      },
      {
        id: 9,
        memberId: 1,
        memberName: "Tesfaye",
        memberPhone: "0911223344",
        date: "2026-08-08",
        checkIn: "08:40",
        checkOut: "10:20",
        status: "Present",
      },
      {
        id: 10,
        memberId: 2,
        memberName: "Abel",
        memberPhone: "0912334455",
        date: "2026-08-07",
        checkIn: "",
        checkOut: "",
        status: "Absent",
      },
    ]);

  // ==========================
  // Search
  // ==========================

  const [search, setSearch] =
    useState("");

  // ==========================
  // Date Filter
  // ==========================

  const [dateFilter, setDateFilter] =
    useState("all");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // ==========================
  // Status Filter
  // ==========================

  const [status, setStatus] =
    useState("All");

  // ==========================
  // Pagination
  // ==========================

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 5;

  // ==========================
  // Check-In Modal
  // ==========================

  const [
    showCheckInModal,
    setShowCheckInModal,
  ] = useState(false);

  // ==========================
  // Open Check-In
  // ==========================

  const handleCheckIn = () => {
    setShowCheckInModal(true);
  };

  // ==========================
  // Close Check-In
  // ==========================

  const handleCloseCheckIn = () => {
    setShowCheckInModal(false);
  };

  // ==========================
  // Save Check-In
  // ==========================

  const handleSaveCheckIn = (
    attendanceData
  ) => {
    const selectedMember =
      members.find(
        (member) =>
          member.id ===
          attendanceData.memberId
      );

    const newAttendance = {
      id: Date.now(),
      memberPhone:
        selectedMember?.phone || "",
      ...attendanceData,
    };

    setAttendance((prev) => [
      newAttendance,
      ...prev,
    ]);

    setCurrentPage(1);

    setShowCheckInModal(false);
  };

  // ==========================
  // Check-Out
  // ==========================

  const handleCheckOut = (attendanceId) => {
    const now = new Date();

    const checkOutTime =
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    setAttendance((prev) =>
      prev.map((record) => {
        if (record.id !== attendanceId) {
          return record;
        }

        if (record.checkOut) {
          return record;
        }

        return {
          ...record,
          checkOut: checkOutTime,
        };
      })
    );
  };

  // ==========================
  // Reset Filters
  // ==========================

  const handleResetFilters = () => {
    setSearch("");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
    setStatus("All");
    setCurrentPage(1);
  };

  // ==========================
  // Filter Attendance
  // ==========================

  const filteredAttendance =
    attendance.filter((record) => {

      // --------------------------
      // Search
      // --------------------------

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        record.memberName
          .toLowerCase()
          .includes(searchValue) ||
        record.memberPhone
          ?.toLowerCase()
          .includes(searchValue) ||
        String(record.memberId)
          .toLowerCase()
          .includes(searchValue);

      // --------------------------
      // Date
      // --------------------------

      let matchesDate = true;

      if (dateFilter === "today") {
        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        matchesDate =
          record.date === today;
      }

      if (dateFilter === "specific") {
        matchesDate =
          !startDate ||
          record.date === startDate;
      }

      if (dateFilter === "range") {
        const afterStart =
          !startDate ||
          record.date >= startDate;

        const beforeEnd =
          !endDate ||
          record.date <= endDate;

        matchesDate =
          afterStart && beforeEnd;
      }

      // --------------------------
      // Status
      // --------------------------

      const matchesStatus =
        status === "All" ||
        record.status === status;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStatus
      );
    });

  // ==========================
  // Pagination Calculation
  // ==========================

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

  // ==========================
  // Return
  // ==========================

  return (
    <div>

      {/* ==========================
          Header
      ========================== */}

      <AttendanceHeader
        onCheckIn={handleCheckIn}
      />

      {/* ==========================
          Statistics
      ========================== */}

      <AttendanceStats
        attendance={filteredAttendance}
      />

      {/* ==========================
          Filters
      ========================== */}

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

      {/* ==========================
          Attendance Table
      ========================== */}

      <AttendanceTable
        attendance={paginatedAttendance}
        onCheckOut={handleCheckOut}
      />

      {/* ==========================
          Pagination
      ========================== */}

      <div className="mt-6 flex justify-center">

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>

      {/* ==========================
          Check-In Modal
      ========================== */}

      <Modal
        isOpen={showCheckInModal}
        title="Member Check In"
        onClose={handleCloseCheckIn}
      >
        <AttendanceForm
          members={members}
          attendance={attendance}
          onSave={handleSaveCheckIn}
        />
      </Modal>

    </div>
  );
}

export default Attendance;