import json
import os
import psycopg2

SCHEMA = 't_p59771403_eco_wood_website'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """CRUD API для товаров: GET список, POST обновление поля (inStock, name, price и др.)"""
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
        cur.execute(f"SELECT id, name, description, badge, badge_color, image_url, in_stock, sort_order FROM {SCHEMA}.products ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        products = [
            {'id': r[0], 'name': r[1], 'description': r[2], 'badge': r[3],
             'badgeColor': r[4], 'imageUrl': r[5], 'inStock': r[6], 'sortOrder': r[7]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'products': products})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'update_stock':
            pid = body['id']
            in_stock = body['inStock']
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.products SET in_stock = %s WHERE id = %s", (in_stock, pid))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        if action == 'update_product':
            pid = body['id']
            fields = {}
            if 'name' in body: fields['name'] = body['name']
            if 'description' in body: fields['description'] = body['description']
            if 'badge' in body: fields['badge'] = body['badge']
            if 'imageUrl' in body: fields['image_url'] = body['imageUrl']
            if not fields:
                return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'No fields'})}
            set_clause = ', '.join(f"{k} = %s" for k in fields)
            values = list(fields.values()) + [pid]
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.products SET {set_clause} WHERE id = %s", values)
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
