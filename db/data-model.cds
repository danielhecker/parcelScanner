namespace my.parcelscanner;

    using { managed } from '@sap/cds/common';

entity Parcels: managed {
  key ID:           String;
  providerId:       String  null;
  providerName:     String  null;
  sender:           String  null;
  deliveryDate:     Date  null; // yyyy-MM-dd
  deliveryTime:     Time  null; // HH:mm:ss.S
  recipientName:    String  null;
  recipientStreet:  String  null;
  recipientZip:     String  null;
  scanDateTime:     DateTime null; // ISO-Timestamp
  status:           Integer default 1; // 1,2,3
  delayed:          Boolean default false; // true
}