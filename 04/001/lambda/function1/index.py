import datetime
import mysql.connector
import os


db_endpoint_port = os.environ['DB_ENDPOINT_PORT']
db_name = os.environ['DB_NAME']
db_password = os.environ['DB_PASSWORD']
db_proxy_endpoint_address = os.environ['DB_PROXY_ENDPOINT_ADDRESS']
db_tablename = os.environ['DB_TABLENAME']
db_user = os.environ['DB_USER']
region = os.environ['REGION']


def lambda_handler(event, context):
    conn = mysql.connector.connect(
        host=db_proxy_endpoint_address,
        port=db_endpoint_port,
        user=db_user,
        password=db_password,
        database=db_name
        )
    cur = conn.cursor()
    
    now = datetime.datetime.now()
    now_str = now.strftime('%Y-%m-%d %H:%M:%S')
    write_sql = 'insert into {tbl} values ("{now}");'.format(
        tbl=db_tablename,
        now=now_str
    )
    cur.execute(write_sql)
    cur.close()
    conn.commit()
    
    return {
        'statusCode': 200,
        'body': str(now)
    }
