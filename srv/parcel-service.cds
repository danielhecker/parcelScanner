using my.parcelscanner as my from '../db/data-model';

service ParcelService {
    entity Parcels as projection on my.Parcels
}
