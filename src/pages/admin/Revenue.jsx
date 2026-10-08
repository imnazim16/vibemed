import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Button,
  Table,
  Select,
  Modal,
  Space,
  Avatar,
  Divider,
  Statistic,
  Tooltip,
} from 'antd';
import {
  DollarOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  ShopOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { doctorService } from '../../services/doctorService';
import { clinicService } from '../../services/clinicService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const Revenue = () => {
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedClinic, setSelectedClinic] = useState('All');
  const [clinics, setClinics] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalGross: 0,
    totalSitting: 0,
    totalNet: 0,
    totalPatients: 0,
    doctorReports: [],
  });

  // Invoice modal state
  const [invoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceDoctor, setInvoiceDoctor] = useState(null); // null = consolidated hospital statement

  const loadData = async () => {
    const clinicsList = await clinicService.getAll();
    setClinics(clinicsList);
    const report = doctorService.getMonthlyRevenueReport(selectedMonth, selectedClinic);
    setRevenueData(report);
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedClinic]);

  const handleOpenDoctorInvoice = (doctorReport) => {
    setInvoiceDoctor(doctorReport);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenConsolidatedInvoice = () => {
    setInvoiceDoctor(null);
    setIsInvoiceModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Columns for the Doctor Billing & Performance Table
  const columns = [
    {
      title: 'Physician / Specialist',
      key: 'doctor',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} size={40} style={{ border: '2px solid #0d9488' }} />
          <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>
              {record.doctorName}
            </Text>
            <Tag color="geekblue" style={{ fontSize: 10, margin: 0 }}>
              {record.specialty}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Clinics Practiced',
      key: 'clinics',
      render: (_, record) => (
        <Space size={3} wrap>
          {record.clinicsBreakdown?.map((cb) => {
            const cName = cb.clinicName ? String(cb.clinicName).split(' ')[0] : 'Clinic';
            return (
              <Tag key={cb.clinicId || Math.random()} color="purple" style={{ fontSize: 11 }}>
                {cName} ({cb.daysWorked || 0}d)
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Patients Treated',
      dataIndex: 'patientsTreated',
      key: 'patientsTreated',
      align: 'center',
      render: (count) => (
        <Tag color="blue" style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px' }}>
          {count || 0} Visits
        </Tag>
      ),
    },
    {
      title: 'Gross Patient Billing',
      dataIndex: 'grossBilled',
      key: 'grossBilled',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#0d9488', fontSize: 14 }}>
          ${(Number(val) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Clinic Sitting Fees',
      dataIndex: 'totalSittingFee',
      key: 'totalSittingFee',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#dc2626', fontSize: 13 }}>
          -${(Number(val) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Net Doctor Payout',
      dataIndex: 'netPayout',
      key: 'netPayout',
      align: 'right',
      render: (val) => (
        <span style={{ fontWeight: 800, color: '#0369a1', fontSize: 14 }}>
          ${(Number(val) || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Settlement Status',
      key: 'status',
      align: 'center',
      render: () => <Tag color="green">Settled / Verified</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          size="small"
          icon={<FilePdfOutlined />}
          onClick={() => handleOpenDoctorInvoice(record)}
          style={{ borderColor: '#0d9488', color: '#0d9488', borderRadius: 6 }}
        >
          Invoice
        </Button>
      ),
    },
  ];

  return (
    <div className="vibemed-revenue-page">
      <PageHeader
        title="Monthly Clinical Revenue & Invoicing Suite"
        subtitle="Track multi-location patient billings, clinic daily sitting charges, and printable monthly doctor invoices"
        extra={[
          <Select
            key="month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            style={{ width: 170 }}
            size="large"
          >
            <Option value="September 2026">September 2026</Option>
            <Option value="August 2026">August 2026</Option>
            <Option value="July 2026">July 2026</Option>
          </Select>,
          <Select
            key="clinic"
            value={selectedClinic}
            onChange={setSelectedClinic}
            style={{ width: 220 }}
            size="large"
          >
            <Option value="All">All Clinic Locations</Option>
            {clinics.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>,
          <Button
            key="printStatement"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handleOpenConsolidatedInvoice}
            style={{ backgroundColor: '#0d9488', borderRadius: 8 }}
          >
            Print Monthly Statement
          </Button>,
        ]}
      />

      {/* 4 Financial KPI Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#f0fdfa' }}>
            <Statistic
              title={<span style={{ color: '#0f766e', fontWeight: 600 }}>Total 1-Month Gross Billing</span>}
              value={revenueData.totalGross}
              prefix="$"
              valueStyle={{ color: '#0d9488', fontWeight: 800, fontSize: 28 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#14b8a6', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpOutlined />
              <span>+14.5% vs previous billing cycle</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#fef2f2' }}>
            <Statistic
              title={<span style={{ color: '#991b1b', fontWeight: 600 }}>Clinic Sitting Charges Retained</span>}
              value={revenueData.totalSitting}
              prefix="$"
              valueStyle={{ color: '#dc2626', fontWeight: 800, fontSize: 28 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>
              Facility fees collected from practicing shifts
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#f0f9ff' }}>
            <Statistic
              title={<span style={{ color: '#075985', fontWeight: 600 }}>Net Doctor Payouts Disbursed</span>}
              value={revenueData.totalNet}
              prefix="$"
              valueStyle={{ color: '#0284c7', fontWeight: 800, fontSize: 28 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#0369a1' }}>
              Net clinical earnings after facility deductions
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: '#fefce8' }}>
            <Statistic
              title={<span style={{ color: '#854d0e', fontWeight: 600 }}>Total Patients Treated & Billed</span>}
              value={revenueData.totalPatients}
              suffix="Visits"
              valueStyle={{ color: '#ca8a04', fontWeight: 800, fontSize: 28 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#a16207' }}>
              Avg billing: $
              {revenueData.totalPatients > 0
                ? Math.round(revenueData.totalGross / revenueData.totalPatients)
                : 0}{' '}
              / consultation
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Doctor Revenue & Billing Table */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarOutlined style={{ color: '#0d9488' }} />
            <span>Physician Billing Roster & Remittance Breakdown ({selectedMonth})</span>
          </div>
        }
        extra={
          <Text type="secondary" style={{ fontSize: 12 }}>
            Showing records for: <strong>{selectedClinic === 'All' ? 'All Clinics' : 'Selected Clinic'}</strong>
          </Text>
        }
        style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 24 }}
      >
        {/* Desktop Table View */}
        <div className="vibemed-desktop-table">
          <Table
            columns={columns}
            dataSource={revenueData.doctorReports}
            rowKey="doctorId"
            pagination={false}
            scroll={{ x: 800 }}
          />
        </div>

        {/* Mobile Card View */}
        <div className="vibemed-mobile-cards">
          {revenueData.doctorReports.map((doc) => (
            <Card
              key={doc.doctorId}
              style={{
                borderRadius: 14,
                marginBottom: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              }}
              styles={{ body: { padding: '14px 16px' } }}
            >
              {/* Doctor Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar src={doc.avatar} size={40} style={{ border: '2px solid #0d9488' }}>
                    {doc.doctorName?.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{doc.doctorName}</div>
                    <Tag color="geekblue" style={{ fontSize: 10, margin: 0 }}>{doc.specialty}</Tag>
                  </div>
                </div>
                <Tag color="green">Settled</Tag>
              </div>

              {/* Financial Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  background: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: 8,
                  marginBottom: 10,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Visits: </span>
                  <strong>{doc.patientsTreated}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Gross: </span>
                  <strong style={{ color: '#0d9488' }}>${(Number(doc.grossBilled) || 0).toLocaleString()}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Sitting Fee: </span>
                  <strong style={{ color: '#dc2626' }}>-${(Number(doc.totalSittingFee) || 0).toLocaleString()}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Net Payout: </span>
                  <strong style={{ color: '#0369a1', fontSize: 13 }}>${(Number(doc.netPayout) || 0).toLocaleString()}</strong>
                </div>
              </div>

              {/* Action Button */}
              <Button
                block
                icon={<FilePdfOutlined />}
                onClick={() => handleOpenDoctorInvoice(doc)}
                style={{ borderRadius: 8, borderColor: '#0d9488', color: '#0d9488', minHeight: 36 }}
              >
                View & Print Invoice
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Per-Clinic Branch Financial Comparison Cards */}
      <Title level={4} style={{ marginBottom: 14 }}>
        <ShopOutlined style={{ marginRight: 8, color: '#0d9488' }} />
        Location Revenue & Sitting Fee Breakdown across 4 Clinics
      </Title>

      <Row gutter={[16, 16]}>
        {clinics.map((clinic) => {
          let branchPatients = 0;
          let branchGross = 0;
          let branchSitting = 0;

          revenueData.doctorReports.forEach((doc) => {
            const match = doc.clinicsBreakdown?.find((cb) => cb.clinicId === clinic.id);
            if (match) {
              branchPatients += match.patientsTreated || 0;
              branchGross += match.amountBilled || 0;
              branchSitting += match.totalSittingFee || 0;
            }
          });

          return (
            <Col xs={24} sm={12} lg={6} key={clinic.id}>
              <Card
                style={{
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  height: '100%',
                  background: '#ffffff',
                }}
                styles={{ body: { padding: 18 } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{clinic.name}</span>
                  <Tag color="cyan">{clinic.branchCode}</Tag>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
                  Daily Doctor Sitting Charge: <strong>${clinic.sittingCharge} / day</strong>
                </div>

                <Divider style={{ margin: '8px 0 10px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Patients Consulted:</span>
                    <strong>{branchPatients} Visits</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Gross Patient Billing:</span>
                    <strong style={{ color: '#0d9488' }}>${(Number(branchGross) || 0).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Sitting Fees Retained:</span>
                    <strong style={{ color: '#dc2626' }}>+${(Number(branchSitting) || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* ========================================================
          PRINTABLE & PDF MONTHLY REVENUE INVOICE MODAL
         ======================================================== */}
      <Modal
        open={invoiceModalOpen}
        onCancel={() => setIsInvoiceModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsInvoiceModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
            onClick={handlePrint}
          >
            Print / Save as PDF
          </Button>,
        ]}
        width="100%"
        style={{ maxWidth: 820 }}
      >
        <div id="vibemed-printable-invoice" style={{ padding: '16px 20px', color: '#0f172a' }}>
          {/* Invoice Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0d9488',
              paddingBottom: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  <MedicineBoxOutlined />
                </div>
                <div>
                  <Title level={3} style={{ margin: 0, color: '#0f766e' }}>
                    VibeMed Healthcare Network
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Multi-Clinic Healthcare Operations & Financial Clearinghouse
                  </Text>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
                Tax ID: <strong>VM-948201-HC</strong> • Reg: <strong>#HLTH-2026-HQ</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  background: '#f0fdfa',
                  border: '1px solid #0d9488',
                  padding: '4px 12px',
                  borderRadius: 8,
                  display: 'inline-block',
                  color: '#0d9488',
                  fontWeight: 800,
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                OFFICIAL MONTHLY INVOICE
              </div>
              <div style={{ fontSize: 12 }}>
                Billing Cycle: <strong>{selectedMonth}</strong>
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Statement Subject / Doctor Info */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
            }}
          >
            {invoiceDoctor ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 11 }}>PAYABLE TO / PHYSICIAN:</Text>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                    {invoiceDoctor.doctorName}
                  </div>
                  <Tag color="geekblue" style={{ marginTop: 2 }}>{invoiceDoctor.specialty}</Tag>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>TOTAL PATIENTS TREATED:</Text>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0d9488' }}>
                    {invoiceDoctor.patientsTreated} Patients
                  </div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Consultation Rate: ${invoiceDoctor.fee} / visit
                  </Text>
                </Col>
              </Row>
            ) : (
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>CONSOLIDATED STATEMENT:</Text>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                  All Practicing Physicians across 4 Clinic Locations
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Comprehensive audit of patient billing, daily facility sitting charges, and net remittances.
                </div>
              </div>
            )}
          </div>

          {/* Breakdown Table */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#334155', marginBottom: 8 }}>
              {invoiceDoctor
                ? 'Itemized Clinic Location Shifts & Sitting Charge Breakdown:'
                : 'Physician Billing & Sitting Charge Ledger:'}
            </div>

            {invoiceDoctor ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Clinic Branch Location</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Days Worked</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Patients Seen</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Patient Billing ($)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Sitting Fee Deducted (-$)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Net Doctor Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceDoctor.clinicsBreakdown?.map((cb) => (
                    <tr key={cb.clinicId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>
                        <strong>{cb.clinicName}</strong>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{cb.daysWorked} Days</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{cb.patientsTreated}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#0d9488' }}>
                        ${cb.amountBilled.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>
                        -${cb.totalSittingFee.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#0369a1' }}>
                        ${cb.netPayout.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Doctor / Specialist</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Patients</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Gross Billed</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Sitting Charges</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Net Disbursement</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.doctorReports.map((doc) => (
                    <tr key={doc.doctorId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>
                        <strong>{doc.doctorName}</strong> ({doc.specialty})
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{doc.patientsTreated}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#0d9488' }}>
                        ${doc.grossBilled.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>
                        -${doc.totalSittingFee.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#0369a1' }}>
                        ${doc.netPayout.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Totals Summary Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '2px solid #0d9488',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>Total Patient Consultations Billing Collected:</span>
              <strong style={{ color: '#0d9488' }}>
                $
                {invoiceDoctor
                  ? invoiceDoctor.grossBilled.toLocaleString()
                  : revenueData.totalGross.toLocaleString()}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>Less: Clinic Daily Sitting Charges Retained:</span>
              <strong style={{ color: '#dc2626' }}>
                -$
                {invoiceDoctor
                  ? invoiceDoctor.totalSittingFee.toLocaleString()
                  : revenueData.totalSitting.toLocaleString()}
              </strong>
            </div>

            <Divider style={{ margin: '8px 0 10px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: '#0f766e' }}>
                TOTAL NET REMITTANCE PAYOUT:
              </span>
              <span style={{ fontWeight: 900, color: '#0f766e', fontSize: 22 }}>
                $
                {invoiceDoctor
                  ? invoiceDoctor.netPayout.toLocaleString()
                  : revenueData.totalNet.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center', width: 200 }}>
              <div style={{ borderBottom: '1px solid #94a3b8', height: 40 }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginTop: 4 }}>
                Hospital Chief Financial Officer
              </div>
            </div>

            <div style={{ textAlign: 'center', width: 200 }}>
              <div style={{ borderBottom: '1px solid #94a3b8', height: 40 }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginTop: 4 }}>
                Physician / Clinical Recipient
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Revenue;
