'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  IconButton,
  Pagination,
  Stack,
  Switch,
  FormControlLabel,
  Box,
  Typography
} from '@mui/material'
import { LineChart } from '@mui/x-charts'
import InfoIcon from '@mui/icons-material/Info'
import ErrorAlert from './component/errorAlert'

const getAllItems = async() => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/record/readall`, {cache: "no-store"})
  const jsonData = await response.json()
  const allItems = jsonData.allItems
  return allItems
}

const getWeeklySummary = (allItems: any[]) => {
  const weeklyData: { [key: string]: { total: number, startDate: string, endDate: string } } = {};
  
  allItems.forEach((record: any) => {
    const date = new Date(record.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        total: 0,
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString()
      };
    }
    
    weeklyData[weekKey].total += record.waterIntake;
  });
  
  return Object.entries(weeklyData)
    .sort(([, a], [, b]) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .map(([period, data]) => ({
      period,
      total: data.total
    }));
};

const getStatusColor = (total: number) => {
  if (total < 200 || total >= 500) return { status: '異常', color: '#ffebee' };
  if (total > 250) return { status: '要観察', color: '#fff3e0' };
  return { status: '平常', color: '#e8f5e9' };
};

const getLast30DaysData = (allItems: any[]) => {
  // 変更点: 最新のデータが存在する日を一番右に表示する
  // allItems の中から最新日を取得し、その日を終端にして過去30日分を表示します
  // （従来は今日を終端にしていた）

  // 日付形式は 'YYYY-MM-DD' を前提
  const recordDates = allItems.map((r: any) => r.date.substring(0, 10));
  const latestRecordDateStr = recordDates.reduce((a: string, b: string) => (a > b ? a : b));
  const endDate = new Date(latestRecordDateStr);
  const thirtyDaysAgo = new Date(endDate);
  thirtyDaysAgo.setDate(endDate.getDate() - 29); // endDate を含む 30 日間

  const dateArray = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const dailyData = new Map<string, number>();
  dateArray.forEach(date => dailyData.set(date, 0));

  allItems.forEach((record: any) => {
    const recordDate = record.date.substring(0, 10);
    if (dailyData.has(recordDate)) {
      dailyData.set(recordDate, (dailyData.get(recordDate) || 0) + record.waterIntake);
    }
  });

  return {
    xAxis: dateArray.map(date => {
      const [y, m, d] = date.split('-');
      return `${Number(m)}/${Number(d)}`;
    }),
    yAxis: Array.from(dailyData.values())
  };
};

const ReadAllItems = () => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const items = await getAllItems();
      setAllItems(items);
    };
    fetchData();
  }, []);

  // フィルタリングと日付でソート（降順）
  const filteredAndSortedItems = [...allItems]
    .filter(item => !showOnlyAlerts || item.remark)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 現在のページのアイテムを取得
  const currentItems = filteredAndSortedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (checked: boolean) => {
    if (checked) {
      const filteredItems = allItems.filter(item => item.remark);
      if (filteredItems.length === 0) {
        setErrorMessage('備考ありのレコードがありません');
        setShowOnlyAlerts(false);
        return;
      }
    }
    setErrorMessage('');
    setShowOnlyAlerts(checked);
    setPage(1);
  };

  const weeklySummary = getWeeklySummary(allItems);

  return (
    <>
      <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyAlerts}
              onChange={(e) => handleFilterChange(e.target.checked)}
              color="error"
            />
          }
          label="備考ありのみ表示"
        />
      </Stack>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>日付</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>飲水量</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">詳細</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((record: any) => (
              <TableRow 
                key={record._id}
                sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>
                  <Link href={`/record/readsingle/${record._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {record.date.substring(0, 10)}
                  </Link>
                </TableCell>
                <TableCell>{record.waterIntake}ml</TableCell>
                <TableCell align="center">
                  <Link href={`/record/delete/${record._id}`} style={{ textDecoration: 'none' }}>
                    <IconButton color={record.remark ? "error" : "info"} size="small">
                      <InfoIcon />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 3 }}>
        <Pagination 
          count={Math.ceil(filteredAndSortedItems.length / itemsPerPage)} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 4, mb: 4, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>期間</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>総飲水量</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>評価</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeklySummary.map((week) => {
              const { status, color } = getStatusColor(week.total);
              return (
                <TableRow 
                  key={week.period}
                  sx={{ backgroundColor: color }}
                >
                  <TableCell>{week.period}</TableCell>
                  <TableCell>{week.total}ml</TableCell>
                  <TableCell>{status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, mb: 4 }}>
        <Paper sx={{ boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            過去30日間の水分摂取量グラフ
          </Typography>
          
          {allItems.length > 0 && (() => {
            const { xAxis, yAxis } = getLast30DaysData(allItems);
            return (
              <LineChart
                xAxis={[{ 
                  data: xAxis,
                  label: '日付',
                  scaleType: 'point',
                  tickMinStep: 1
                }]}
                yAxis={[{ 
                  min: 0,
                  max: 500
                }]}
                series={[{
                  data: yAxis,
                  area: true,
                  showMark: true,
                  label: '1日あたりの飲水量'
                }]}
                height={300}
              />
            );
          })()}
        </Paper>
      </Box>
    </>
  )
}

export default ReadAllItems