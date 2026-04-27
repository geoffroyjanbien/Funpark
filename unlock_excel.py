#!/usr/bin/env python3
"""
Unlock password-protected Excel file
Requires: pip install msoffcrypto-tool
"""

import msoffcrypto
import io
import os

def unlock_excel(input_file, output_file, password):
    """Unlock a password-protected Excel file"""
    try:
        print(f"Unlocking {input_file}...")
        
        # Open the encrypted file
        with open(input_file, 'rb') as encrypted_file:
            office_file = msoffcrypto.OfficeFile(encrypted_file)
            
            # Provide the password
            office_file.load_key(password=password)
            
            # Decrypt and save
            with open(output_file, 'wb') as decrypted_file:
                office_file.decrypt(decrypted_file)
        
        print(f"✓ Successfully unlocked to {output_file}")
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    # File paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    manager_dir = os.path.join(script_dir, 'Manager', 'Excel')
    
    input_file = os.path.join(manager_dir, 'fun park - 10.xlsx')
    output_file = os.path.join(manager_dir, 'fun park - 10.xlsx')  # Overwrite original
    password = 'f123'
    
    # Check if file exists
    if not os.path.exists(input_file):
        print(f"✗ File not found: {input_file}")
        exit(1)
    
    # Unlock the file
    if unlock_excel(input_file, output_file, password):
        print("\n✓ File unlocked successfully!")
        print("You can now run: cd server && node importManager.js")
    else:
        print("\n✗ Failed to unlock file")
        print("Please unlock manually in Excel")
