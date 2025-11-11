import React from "react";
import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, Label } from 'recharts';
const formatToK = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toString();
};
export default function Dashboard() {
  const data = [
    {
      name: 'Mon',
      value: 40,
    },
    {
      name: 'Tue',
      value: 30,
    },
    {
      name: 'Wed',
      value: 4,
    },
    {
      name: 'Thu',
      value: 27,
    },
    {
      name: 'Fri',
      value: 18,
    },
    {
      name: 'Sat',
      value: 23,
    },
    {
      name: 'Sun',
      value: 34,
    },
  ];
  const data2 = [
    {
      name: 'Mon',
      value: 4200,
      displayValue: formatToK(4200),
    },
    {
      name: 'Tue',
      value: 2800,
      displayValue: formatToK(4200),
    },
    {
      name: 'Wed',
      value: 3050,
      displayValue: formatToK(3050),
    },
    {
      name: 'Thu',
      value: 1060,
      displayValue: formatToK(4200),
    },
    {
      name: 'Fri',
      value: 970,
      displayValue: formatToK(970),
    },
    {
      name: 'Sat',
      value: 1199,
      displayValue: formatToK(1199),
    },
    {
      name: 'Sun',
      value: 900,
      displayValue: formatToK(900),
    },
  ];
  const data3 = [
    {
      name: 'Mon',
      value: 40,
      value2: 24,
    },
    {
      name: 'Tue',
      value: 30,
      value2: 13,
    },
    {
      name: 'Wed',
      value: 4,
      value2: 58,
    },
    {
      name: 'Thu',
      value: 27,
      value2: 39,
    },
    {
      name: 'Fri',
      value: 18,
      value2: 48,
    },
    {
      name: 'Sat',
      value: 23,
      value2: 38,
    },
    {
      name: 'Sun',
      value: 34,
      value2: 43,
    },
  ];
  return (
    <React.Fragment>
      <Row className="g-3 mb_20">
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor1">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="lucide:users-round" />
              </span>
              <h4>1,500</h4>
            </div>
            <div className="stats_body">
              <p>Total Users</p>
              <h5 className="upgrade">+33.45%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor2">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="lucide-lab:house" />
              </span>
              <h4>874</h4>
            </div>
            <div className="stats_body">
              <p>Active Properties</p>
              <h5 className="upgrade">+76.98%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor3">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="fluent-mdl2:reservation-orders" />
              </span>
              <h4>1259</h4>
            </div>
            <div className="stats_body">
              <p>Active Bookings</p>
              <h5 className="downgrade">-10.67%<Icon icon="iconamoon:trend-down" /></h5>
            </div>
          </div>
        </Col>
        <Col xl={3} lg={3} sm={6}>
          <div className="stats_card bgcolor4">
            <div className="stats_head">
              <span className="stats_icon">
                <Icon icon="streamline:bag-dollar" />
              </span>
              <h4>$3,450</h4>
            </div>
            <div className="stats_body">
              <p>Total Revenue</p>
              <h5 className="upgrade">+56.67%<Icon icon="iconamoon:trend-up" /></h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="g-3">
        <Col lg={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Recent Bookings</h4>
            </div>
            <div className="Card_body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <Tooltip
                    cursor={false}
                    formatter={(value) => [`${value}`, 'Bookings']}
                    labelFormatter={(label) => ` ${label}`}
                  />
                  <CartesianGrid vertical={false} stroke="#F2F2F2" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                    padding={{ left: 20, right: 0 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }}>
                    <Label
                      value="No. of Bookings"
                      angle={-90}
                      position="insideLeft"
                      offset={10}
                      style={{ textAnchor: 'middle', fill: '#6B7280', fontSize: 12 }}
                    />
                  </YAxis>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4FC36E"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#4FC36E", strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Revenue</h4>
            </div>
            <div className="Card_body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data2}
                  margin={{ top: 20, right: 0, left: -15, bottom: 0 }}
                  barSize={26}
                >
                  <Tooltip
                    cursor={false}
                    labelFormatter={(label) => `${label}`}
                    formatter={(value) => [`$${formatToK(value)}`, 'Revenue']}
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
                    fill="#12477B"
                    name="Revenue"
                    formatter={(value) => `$${formatToK(value)}`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col lg={12}>
          <div className="box_Card">
            <div className="Card_head">
              <h4>Recent Users / Hosts</h4>
            </div>
            <div className="Card_body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data3} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <Tooltip
                    cursor={false}
                    formatter={(value, name) => {
                      if (name === 'value') return [`${value}`, 'Users'];
                      if (name === 'value2') return [`${value}`, 'Hosts'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => ` ${label}`}
                  />
                  <CartesianGrid vertical={false} stroke="#F2F2F2" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                    padding={{ left: 20, right: 0 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8e54e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#8e54e5", strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value2"
                    stroke="#cb78d3"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, stroke: "#cb78d3", strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}