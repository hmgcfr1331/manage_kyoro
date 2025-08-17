import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
} from '@mui/material';

const pages = [
  { title: '一覧', path: '/' },
  { title: '記録', path: '/record/create' },
  { title: 'ログイン', path: '/user/login' },
  { title: '登録', path: '/user/register' },
];

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', zIndex: 1000 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ロゴ部分 */}
          {/*}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="../"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Kyoro管理
          </Typography>
          */}

          {/* ナビゲーションメニュー */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={Link}
                href={page.path}
                sx={{ 
                  color: 'white',
                  display: 'block',
                  textAlign: 'center',
                  padding: '6px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header