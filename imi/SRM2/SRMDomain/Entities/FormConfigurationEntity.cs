#region Namespace
namespace SRMDomain.Entities
{
    public class FormConfigurationEntity
    {
        public int Id { get; set; }
        public string ConfigurationCode { get; set; }
        public string ConfigurationName { get; set; }
        public string Module { get; set; }
        public string ElementItem { get; set; }
        public int ElementCount { get; set; }
        public string Configuration { get; set; }
        public string ProcessStep { get; set; }
    }
}
#endregion