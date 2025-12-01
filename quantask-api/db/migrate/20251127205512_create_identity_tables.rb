class CreateIdentityTables < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name
      t.string :last_name
      
      # 2FA Fields
      t.string :phone_number
      t.string :otp_method, default: 'email'
      t.string :otp_code
      t.datetime :otp_expires_at

      # Password Reset Fields
      t.string :reset_password_token
      t.datetime :reset_password_sent_at

      t.timestamps
    end
    
    add_index :users, :email, unique: true
    add_index :users, :reset_password_token, unique: true
  end
end
