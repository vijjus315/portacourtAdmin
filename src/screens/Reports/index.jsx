import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import DataTable from "react-data-table-component";
const formatToK = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toString();
};
export default function Reports() {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return {
          color: '#40A57A',
        };
      case 'Pending':
        return {
          color: '#f7bc06',
        };
      default:
        return {};
    }
  };
  const Revenuedata = [
    {
      name: 'Mon',
      value: 4200,
      value2: 3690,
      value3: 2100,
    },
    {
      name: 'Tue',
      value: 2800,
      value2: 2380,
      value3: 2100,
    },
    {
      name: 'Wed',
      value: 3050,
      value2: 2640,
      value3: 2100,
    },
    {
      name: 'Thu',
      value: 1060,
      value2: 940,
      value3: 2100,
    },
    {
      name: 'Fri',
      value: 970,
      value2: 840,
      value3: 2100,
    },
    {
      name: 'Sat',
      value: 1199,
      value2: 1040,
      value3: 2100,
    },
    {
      name: 'Sun',
      value: 900,
      value2: 740,
      value3: 2100,
    },
  ];
  const data2 = [
    { name: "New Request", value: 45 },
    { name: "Completed", value: 120 },
    { name: "Cancelled", value: 25 },
  ];
  const COLORS = ["#AFADDF", "#10b981", "#ef4444"];
  const isMobile = window.innerWidth < 576;
  const innerRadius = isMobile ? 47 : 70;
  const outerRadius = isMobile ? 67 : 110;
  const fontSize = isMobile ? "9px" : "11px";
  const columns = [
    {
      name: '',
      minWidth: '160px',
      selector: row => row.Month,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Month</h4>
          {row.Month}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '180px',
      selector: row => row.Bookings,
      cell: (row) => (
        <div>
          <h4>Bookings</h4>
          {row.Bookings}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '130px',
      selector: row => row.Revenue,
      cell: (row) => (
        <div>
          <h4>Revenue</h4>
          {row.Revenue}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '130px',
      selector: row => row.Value,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Avg. Value</h4>
          {row.Value}
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '130px',
      selector: row => row.Growth,
      style: {
        textTransform: 'capitalize'
      },
      cell: (row) => (
        <div>
          <h4>Growth</h4>
          <span style={{ color: '#4FC36E' }}>{row.Growth}</span>
        </div>
      ),
      sortable: false,
    },
    {
      name: '',
      minWidth: '110px',
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
  ];
  const Tabledata = [
    {
      id: 1, Month: 'November 2025', Bookings: '156', Revenue: '$16,068', Value: '$103', Growth: '+12.5%', Status: 'Completed',
    },
    {
      id: 2, Month: 'October 2025', Bookings: '156', Revenue: '$16,068', Value: '$103', Growth: '+12.5%', Status: 'Pending',
    },
    {
      id: 3, Month: 'September 2025', Bookings: '156', Revenue: '$16,068', Value: '$103', Growth: '+12.5%', Status: 'Completed',
    },
    {
      id: 4, Month: 'August 2025', Bookings: '156', Revenue: '$16,068', Value: '$103', Growth: '+12.5%', Status: 'Pending',
    },
    {
      id: 5, Month: 'July 2025', Bookings: '156', Revenue: '$16,068', Value: '$103', Growth: '+12.5%', Status: 'Completed',
    },
  ]
  return (
    <React.Fragment>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb_20">
        <Form style={{ maxWidth: 160, minWidth: 160 }}>
          <Form.Group className="form-group">
            <div className="position-relative">
              <Form.Select defaultValue='Last7Days' style={{ height: 46 }}>
                <option value='Select'>Select Date</option>
                <option value='Last7Days'>Last 7 Days</option>
                <option value='Last30Days'>Last 30 Days</option>
                <option value='Last3Months'>Last 3 Months</option>
                <option value='LastYear'>Last Year</option>
              </Form.Select>
              <Icon icon="meteor-icons:chevron-down" className="custom-arrow-icon" />
            </div>
          </Form.Group>
        </Form>
        <Button className="btn-sm">Generate Report</Button>
      </div>
      <Row className="g-3 mb_20">
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor1">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="fluent-mdl2:reservation-orders" />
              </span>
              <h4>874</h4>
            </div>
            <div className="stats_body">
              <p>Total Bookings</p>
              <h5 className="downgrade">-10.67%<Icon icon="iconamoon:trend-down" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor2">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="lucide-lab:house" />
              </span>
              <h4>1259</h4>
            </div>
            <div className="stats_body">
              <p>Total Properties</p>
              <h5 className="upgrade">+76.98%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor3">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="lucide:file-text" />
              </span>
              <h4>$3,450</h4>
            </div>
            <div className="stats_body">
              <p>Pending Invoices</p>
              <h5 className="upgrade">+56.67%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor4">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="streamline:bag-dollar" />
              </span>
              <h4>$1,500</h4>
            </div>
            <div className="stats_body">
              <p>Total Revenue</p>
              <h5 className="upgrade">+33.45%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="g-3">
        <Col lg={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Revenue</h4>
            </div>
            <div className="Card_body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Revenuedata}
                  margin={{ top: 20, right: 0, left: -15, bottom: 0 }}
                  barSize={8}
                >
                  <Tooltip
                    cursor={false}
                    labelFormatter={(label) => `${label}`}
                    formatter={(value, name) => {
                      if (name === "value") return [`$${value}`, "Apartment"];
                      if (name === "value2") return [`$${value}`, "House"];
                      if (name === "value3") return [`$${value}`, "Villa"];
                      return [`$${value}`, name];
                    }}
                  />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F2F2F2" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={0}
                    tick={(props) => {
                      const { x, y, payload } = props;
                      return (
                        <foreignObject x={x - 40} y={y} width={80} height={50}>
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: '#737B8B',
                              marginBottom: 0,
                              textAlign: 'center',
                            }}
                          >
                            {payload.value}
                          </p>
                        </foreignObject>
                      );
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickCount={6}
                    domain={[0, 5000]}
                    tickFormatter={(value) => `$${formatToK(value)}`}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 0, 0, 0]}
                    fill="#8e54e5"
                    name="Apartment"
                    formatter={(value) => `$${formatToK(value)}`}
                  />
                  <Bar
                    dataKey="value2"
                    radius={[0, 0, 0, 0]}
                    fill="#cb78d3"
                    name="House"
                    formatter={(value) => `$${formatToK(value)}`}
                  />
                  <Bar
                    dataKey="value3"
                    radius={[0, 0, 0, 0]}
                    fill="#12477B"
                    name="Villa"
                    formatter={(value) => `$${formatToK(value)}`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Booking</h4>
            </div>
            <div className="Card_body">
              <div style={{ position: "relative", zIndex: 1, width: "100%", height: isMobile ? 250 : 300, }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data2}
                      cx="50%"
                      cy="50%"
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {data2.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{
                            filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.15))",
                            fontSize: fontSize,
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={false}
                      formatter={(value, name) => [`${value}`, `${name}`]}
                      labelFormatter={(label) => ` ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "#111",
                    zIndex: -1,
                  }}
                >
                  <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "700" }}>100%</div>
                  <div style={{ fontSize: isMobile ? "11px" : "13px", color: "#666" }}>Overall</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className="box_Card">
            <div className="Card_head pb-0">
              <h4>Monthly Revenue Breakdown</h4>
            </div>
            <div className="Card_body">
              <DataTable
                columns={columns}
                data={Tabledata}
                responsive
                noTableHead
                className="custom-table"
              />
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}