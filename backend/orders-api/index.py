import json
import os
import psycopg2

SCHEMA = 't_p59771403_eco_wood_website'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """API заказов: POST — создать заказ, GET — список заказов, PATCH — обновить статус"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', 'create')

        if action == 'create':
            name = body.get('name', '').strip()
            phone = body.get('phone', '').strip()
            email = body.get('email', '').strip()
            address = body.get('address', '').strip()
            comment = body.get('comment', '').strip()
            total = int(body.get('total', 0))
            items = body.get('items', [])

            if not name or not phone:
                return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Имя и телефон обязательны'})}

            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.orders (client_name, phone, email, address, comment, total) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (name, phone, email or None, address or None, comment or None, total)
            )
            order_id = cur.fetchone()[0]

            for item in items:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.order_items (order_id, product_name, size, price, quantity) VALUES (%s, %s, %s, %s, %s)",
                    (order_id, item.get('name', ''), item.get('size', ''), int(item.get('price', 0)), int(item.get('quantity', 1)))
                )

            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True, 'id': order_id})}

        if action == 'update_status':
            order_id = body.get('id')
            status = body.get('status')
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.orders SET status = %s WHERE id = %s", (status, order_id))
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, client_name, phone, email, address, comment, total, status, created_at FROM {SCHEMA}.orders ORDER BY created_at DESC LIMIT 100"
        )
        orders_rows = cur.fetchall()

        order_ids = [r[0] for r in orders_rows]
        items_map = {}
        if order_ids:
            placeholders = ','.join(['%s'] * len(order_ids))
            cur.execute(
                f"SELECT order_id, product_name, size, price, quantity FROM {SCHEMA}.order_items WHERE order_id IN ({placeholders})",
                order_ids
            )
            for row in cur.fetchall():
                oid = row[0]
                if oid not in items_map:
                    items_map[oid] = []
                items_map[oid].append({'name': row[1], 'size': row[2], 'price': row[3], 'quantity': row[4]})

        cur.close()
        conn.close()

        orders = [
            {
                'id': r[0],
                'clientName': r[1],
                'phone': r[2],
                'email': r[3],
                'address': r[4],
                'comment': r[5],
                'total': r[6],
                'status': r[7],
                'createdAt': r[8].isoformat() if r[8] else None,
                'items': items_map.get(r[0], []),
            }
            for r in orders_rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'orders': orders})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
