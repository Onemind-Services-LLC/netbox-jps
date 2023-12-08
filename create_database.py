import psycopg2
from psycopg2 import sql
import os


def create_postgres_database(host, port, user, password, database_name):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password
            database='postgres'
        )

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Execute a query to create the new database
        create_database_query = sql.SQL("CREATE DATABASE {}").format(sql.Identifier(database_name))
        
        # Ensure that the CREATE DATABASE statement is not within a transaction block
        connection.autocommit = True

        cursor.execute(create_database_query)

        print(f"Database '{database_name}' created successfully.")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # Reset autocommit to its default value
        if connection:
            connection.autocommit = False

        # Close the cursor and connection in the finally block
        if cursor:
            cursor.close()
        if connection:
            connection.close()


host = os.environ.get('POSTGRES_HOST', 'Unknown Host')
port = 5432
user = os.environ.get('DB_USER', 'webadmin')
password = os.environ.get('DB_PASSWORD', 'webadmin')
database_name = os.environ.get('DB_NAME', 'webadmin')

create_postgres_database(host, port, user, password, database_name)
