using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class MasterDataDto
    {
        public List<CurrencyMasterDto> CurrencyList { get; set; }
        public List<BankMasterDto> BankList { get; set; }
        public List<CountryMaster> CountryList { get; set; }
        public List<CityMasterDto> CityList { get; set; }
        public SettingsMasterDto CategoryLimit { get; set; }
    }
}
