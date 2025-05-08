import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split


def main():
    # Load dataset (update path if necessary)
    csv_path = './WalterWhite/FM 01012024 to 03312025 Cleaned Ver 01(Data 01012024 to 032025).csv'
    df = pd.read_csv(csv_path, low_memory=False, encoding='latin1')

    # Convert date columns to datetime
    df['Order Info::Order Entry Date'] = pd.to_datetime(df['Order Info::Order Entry Date'], errors='coerce')
    df['Ship Date'] = pd.to_datetime(df['Ship Date'], errors='coerce')
    df['Sparta Scans::Ship Complete'] = pd.to_datetime(df['Sparta Scans::Ship Complete'], errors='coerce')

    # Drop rows with missing dates
    df = df.dropna(subset=['Order Info::Order Entry Date', 'Ship Date', 'Sparta Scans::Ship Complete', 'Brand'])

    # Create label: 1 if actual ship date is later than predicted ship date (delayed), else 0
    y = (df['Sparta Scans::Ship Complete'] > df['Ship Date']).astype(int).values.astype(np.float32)

    # Extract features: day of week and month, plus brand
    df['order_dow'] = df['Order Info::Order Entry Date'].dt.dayofweek
    df['pred_dow'] = df['Ship Date'].dt.dayofweek
    df['order_month'] = df['Order Info::Order Entry Date'].dt.month
    df['pred_month'] = df['Ship Date'].dt.month
    brand_dummies = pd.get_dummies(df['Brand'], prefix='brand')
    X = pd.concat([df[['order_dow', 'pred_dow', 'order_month', 'pred_month']], brand_dummies], axis=1).values

    # Ensure feature array uses float32
    X = X.astype(np.float32)

    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Determine input dimension for the model
    input_dim = X_train.shape[1]

    # Define a simple deep learning model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(8, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    # Train the model using batch training
    model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.1
    )

    # Evaluate the model on the test set
    loss, accuracy = model.evaluate(
        X_test, y_test,
        batch_size=32
    )
    print(f'Test Accuracy: {accuracy:.4f}')


if __name__ == '__main__':
    main() 