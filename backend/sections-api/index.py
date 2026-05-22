import json
import os
import psycopg2

SCHEMA = 't_p59771403_eco_wood_website'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """API для управления секциями сайта: GET список, POST обновление порядка/видимости"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, label, icon, sort_order, visible FROM {SCHEMA}.site_sections ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        sections = [
            {'id': r[0], 'label': r[1], 'icon': r[2], 'sortOrder': r[3], 'visible': r[4]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'sections': sections})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'reorder':
            items = body.get('items', [])
            conn = get_conn()
            cur = conn.cursor()
            for item in items:
                cur.execute(
                    f"UPDATE {SCHEMA}.site_sections SET sort_order = %s WHERE id = %s",
                    (item['sortOrder'], item['id'])
                )
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        if action == 'toggle_visible':
            sid = body['id']
            visible = body['visible']
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.site_sections SET visible = %s WHERE id = %s", (visible, sid))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
