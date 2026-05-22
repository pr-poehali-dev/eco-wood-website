import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Получение и обновление заявок для менеджера. v2"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    # Обновление флага is_called если передан PATCH-запрос
    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        request_id = body.get('id')
        is_called = body.get('is_called')
        if request_id is not None and is_called is not None:
            cur.execute(
                "UPDATE t_p59771403_eco_wood_website.contact_requests SET is_called = %s WHERE id = %s",
                (is_called, request_id)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'ok': True})}

    cur.execute(
        "SELECT id, name, phone, message, created_at, is_called FROM t_p59771403_eco_wood_website.contact_requests ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    requests = [
        {
            'id': row[0],
            'name': row[1],
            'phone': row[2],
            'message': row[3],
            'created_at': row[4].isoformat() if row[4] else None,
            'is_called': row[5],
        }
        for row in rows
    ]

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'requests': requests})
    }