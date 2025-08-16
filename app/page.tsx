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
  FormControlLabel
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

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

const ReadAllItems = () => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
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

  const weeklySummary = getWeeklySummary(allItems);

  return (
    <>
      <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyAlerts}
              onChange={(e) => setShowOnlyAlerts(e.target.checked)}
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
    </>
  )
}

export default ReadAllItems