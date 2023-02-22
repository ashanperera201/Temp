
#region Refferences
using System.ComponentModel.DataAnnotations;
#endregion


#region Namespace
namespace SRMPublic.DTO
{
    public class FormConfigurationDto
    {
        public int Id { get; set; }
        public string ConfigurationCode { get; set; }
        [Required]
        public string ConfigurationName { get; set; }
        public string Module { get; set; }
        [Required]
        public string ElementItem { get; set; }
        [Required]
        public int ElementCount { get; set; }
        [Required]
        public string Configuration { get; set; }
        public string ProcessStep { get; set; }
    }
}
#endregion