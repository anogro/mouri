import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  // CORS 처리 (필요 시)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, accountId, type, category, amount, description } = req.body;

    // Vercel 환경변수에서 키값을 가져옵니다. (\n 개행 문자 처리 필수)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '';

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 한국 시간(KST)으로 날짜 포맷팅
    const now = new Date();
    const kstDate = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);

    // 시트에 추가할 한 행(Row) 배열 생성
    const row = [
      userId || 'Family_01',
      kstDate,
      accountId || '',
      type === 'SPEND' ? '지출' : '수입',
      category || '',
      amount || 0,
      description || ''
    ];

    // 시트 이름이 한글인 경우 '시트1!A:G', 영어면 'Sheet1!A:G'로 설정해야 합니다. (기본은 시트1)
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: '시트1!A:G', 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Google Sheets Sync Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
