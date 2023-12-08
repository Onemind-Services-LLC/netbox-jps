import psycopg2
from psycopg2 import sql
import os

def create_postgres_database(host, port, user, password, new_database):
    connection = None
    cursor = None

    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Execute a query to create the new database
        create_database_query = sql.SQL("CREATE DATABASE {}").format(sql.Identifier(new_database))
        cursor.execute(create_database_query)

        print(f"Database '{new_database}' created successfully.")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # Close the cursor and connection in the finally block
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Replace the following with your PostgreSQL credentials and the new database name

host = os.environ.get('POSTGRES_HOST', 'Unknown Host')
port = 5432
user = os.environ.get('DB_USER', 'webadmin')
password = os.environ.get('DB_PASSWORD', 'webadmin')
database_name = os.environ.get('DB_NAME', 'webadmin')


# Call the function with your credentials
create_postgres_database(host, port, user, password, database_name)
