import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Row, Col, Button, Form, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import img1 from "../../assets/img/avatar1.jpg";
import img2 from "../../assets/img/avatar6.jpg";
import img3 from "../../assets/img/avatar3.jpg";
import img4 from "../../assets/img/avatar4.jpg";
import { Link } from "react-router-dom";
import DeleteModal from "../../Component/DeleteModal";
import { fetchUsersByRole } from "../../services/api/users";
import { getAccessToken } from "../../services/api/apiClient";

export default function Host() {
  const [Delete, setDelete] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hostData, setHostData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total_records: 0,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const DeleteToggle = () => setDelete(!Delete);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return {
          color: '#40A57A',
        };
      case 'Inactive':
        return {
          color: '#CA0000',
        };
      default:
        return {};
    }
  };
  const columns = [
    {
      name: '',
      minWidth: '190px',
      selector: row => row.name,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div className="tableuser">
          <Image src={row.img} alt={row.name} />
          <div>
            <h4>Name</h4>
            {row.name}
          </div>
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '180px',
      selector: row => row.Email,
      cell: (row) => (
        <div>
          <h4>Email</h4>
          {row.Email}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '150px',
      selector: row => row.Date,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Join Date</h4>
          {row.Date}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '170px',
      selector: row => row.Bookings,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Total Bookings</h4>
          {row.Bookings}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '170px',
      selector: row => row.TotalRevenue,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Total Revenue</h4>
          {row.TotalRevenue}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '150px',
      selector: row => row.Status,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Status</h4>
          <span style={getStatusStyle(row.Status)} className="statusbadge">{row.Status}</span>
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      width: "120px",
      cell: (row) => {
        const [Popovershow, setPopovershow] = useState(false);
        return (
          <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            flip
            rootClose
            show={Popovershow}
            onToggle={() => setPopovershow(!Popovershow)}
            overlay={(
              <Popover id={`popover-actions-${row.id}`} className="popoverdropdown">
                <Popover.Body
                  onClick={() => setPopovershow(false)}
                >
                  <div className="d-flex flex-column">
                    <Button variant="link" as={Link} className="dropdownitem" to='/host/viewhost'><Icon icon="solar:eye-linear" width={16} height={16} className="me-1" />View</Button>
                    <Button variant="link" as={Link} className="dropdownitem" to='/host/edithost'><Icon icon="mynaui:edit" width={16} height={16} className="me-1" />Edit</Button>
                    <Button variant="link" className="dropdownitem" onClick={DeleteToggle}><Icon icon="fluent:delete-28-regular" width={16} height={16} className="me-1" />Delete</Button>
                  </div>
                </Popover.Body>
              </Popover>
            )}
          >
            <Button variant="link" className="actionbtn p-0" onClick={() => setPopovershow(!Popovershow)}><Icon icon="tabler:dots"/></Button>
          </OverlayTrigger>
        );
      }
    }
  ];

  const resolveProfileImage = useCallback((image) => {
    if (!image) {
      return img1;
    }
    if (/^https?:\/\//i.test(image)) {
      return image;
    }
    const baseEnv =
      import.meta.env.VITE_MEDIA_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL?.replace(/\/admin\/api\/?$/, "/");

    if (baseEnv) {
      const normalizedBase = baseEnv.endsWith("/") ? baseEnv : `${baseEnv}/`;
      const normalizedPath = image.startsWith("/") ? image.slice(1) : image;
      return `${normalizedBase}${normalizedPath}`;
    }

    return image.startsWith("/") ? image : `/${image}`;
  }, []);

  const fetchHosts = useCallback(
    async ({ page = 1, limit = 20, search = "" } = {}) => {
      if (!getAccessToken()) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchUsersByRole({
          roleType: 2,
          page,
          limit,
          search,
        });

        const users = response?.body?.users || [];
        const paginationInfo = response?.body?.pagination;

        const mapped = users.map((user, index) => ({
          id: user.id ?? index,
          img: resolveProfileImage(user.profile_image),
          name: [user.first_name, user.last_name].filter(Boolean).join(" "),
          Email: user.email || "-",
          Date: (() => {
            if (!user.created_at) return "-";
            const date = new Date(user.created_at);
            return Number.isNaN(date.getTime())
              ? "-"
              : date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                });
          })(),
          Bookings:
            typeof user.booking_count === "number"
              ? user.booking_count
              : user.total_bookings || "0",
          PropertiesCount: user.total_properties || "0",
          TotalRevenue:
            typeof user.total_revenue === "number"
              ? user.total_revenue
              : user.total_revenue || "0",
          Status: user.status === 1 ? "Active" : "Inactive",
        }));

        setHostData(mapped);
        if (paginationInfo) {
          setPagination({
            page: paginationInfo.page ?? page,
            limit: paginationInfo.limit ?? limit,
            total_records: paginationInfo.total_records ?? mapped.length,
            total_pages: paginationInfo.total_pages ?? 1,
          });
        }
      } catch (error) {
        console.error("Unable to fetch hosts", error);
      } finally {
        setIsLoading(false);
      }
    },
    [resolveProfileImage]
  );

  useEffect(() => {
    fetchHosts({ page: pagination.page, limit: pagination.limit });
  }, [fetchHosts]);

  const filteredData = useMemo(() => {
    let result = [...hostData];
    if (statusFilter !== "All") {
      result = result.filter((item) => item.Status === statusFilter);
    }
    if (searchText) {
      const normalizedSearch = searchText.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(normalizedSearch)
      );
    }
    return result;
  }, [hostData, statusFilter, searchText]);

  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <h4 className="mainheading">Hosts</h4>
        <Button as={Link} className="btn-sm" to='/host/addhost'><Icon icon="ic:twotone-plus" width={22} height={22} />Add Host</Button>
      </div>
      <div className="tableSearchBox mb-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <Form.Group className="form-group w-100" style={{ maxWidth: 340 }}>
            <Form.Label>Search</Form.Label>
            <Form.Control type="text" placeholder="Enter here" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </Form.Group>
          <Form.Group className="form-group w-100" style={{ maxWidth: 240 }}>
            <Form.Label>Status</Form.Label>
            <div className="position-relative">
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value='All'>All</option>
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
        </div>
      </div>
      <div className="tableMain_card">
        <DataTable
          columns={columns}
          data={filteredData}
          responsive
          noTableHead
          pagination
          progressPending={isLoading}
          className="custom-table"
        />
      </div>
      <DeleteModal show={Delete} onHide={DeleteToggle}/>
    </React.Fragment>
  )
}