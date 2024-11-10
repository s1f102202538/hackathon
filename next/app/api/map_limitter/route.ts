import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const API_LIMIT = 5000; // 1日のAPI呼び出し制限
const LOG_FILE = path.resolve('./api_call_log.json');

function readLog() {
  try {
    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // ファイルが存在しない、またはJSONエラーが発生した場合、初期状態を返す
    return { date: new Date().toISOString().split('T')[0], count: 0 };
  }
}

function writeLog(date: string, count: number) {
  const data = { date, count };
  fs.writeFileSync(LOG_FILE, JSON.stringify(data), 'utf-8');
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const log = readLog();

  if (log.date === today) {
    if (log.count < API_LIMIT) {
      writeLog(today, log.count + 1);
      return NextResponse.json({ allowed: true });
    } else {
      return NextResponse.json({ allowed: false, message: 'API呼び出し件数が上限に達しました。' }, { status: 429 });
    }
  } else {
    // 日付が異なる場合、新しい日付でカウントをリセット
    writeLog(today, 1);
    return NextResponse.json({ allowed: true });
  }
}
