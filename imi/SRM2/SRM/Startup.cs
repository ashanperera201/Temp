using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SRMDomain.Data;
using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.SqlServer;
using SRMDomain;
using SRMDomain.Repositories.Contracts;
using SRMDomain.Repositories.Implementations;
using SRMPublic.Interfaces;
using SRMDomain.Services.Interfaces;
using SRMDomain.Services.Services;
using SRMDomain.Services;
using SRM.AppData;
using SRMDomain.External.Services.Contracts;
using SRMDomain.External.Services.Implementation;
using SRMDomain.Repositories.Contracts.Implementations;

namespace SRM
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // DAPPER CONNECTION STRING
            services.AddSingleton<SrmDapperContext>();
            services.AddScoped<IEntityMapper, EntityMapper>();

            #region Services
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserGroupService, UserGroupService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped<IReviewFormService, ReviewFormService>();
            services.AddScoped<IFormConfigurationService, FormConfigurationService>();
            services.AddScoped<IProcessConfiguratorService, ProcessConfiguratorService>();
            services.AddScoped<ISupplierEmailService, SupplierEmailService>();
            services.AddScoped<ISupplierInformationService, SupplierInformationService>();
            #endregion

            #region Repositories
            services.AddScoped<IReviewFormRepository, ReviewFormRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserGroupRepository, UserGroupRepository>();
            services.AddScoped<IFormConfigurationRepository, FormConfigurationRepository>();
            services.AddScoped<IProcessConfiguratorRepository, ProcessConfiguratorRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            #endregion

            services.AddScoped<ISrmUserData, SrmUserData>();
            services.AddScoped<IPermissionData, PermissionData>();
            services.AddScoped<IRoleData, RoleData>();
            services.AddScoped<ISupplierData, SupplierData>();


            services.AddCors(_ =>
            {
                _.AddDefaultPolicy(dp =>
                {
                    dp.AllowAnyOrigin();
                    dp.AllowAnyHeader();
                    dp.AllowAnyMethod();
                });
            });

            var emailConfig = Configuration
               .GetSection("EmailConfiguration")
               .Get<EmailConfigDto>();
            services.AddSingleton(emailConfig);

            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            #region API Versioning.
            services.AddApiVersioning(config =>
            {
                config.DefaultApiVersion = new ApiVersion(1, 0);
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
            });
            #endregion

            services.AddControllers();

            string domain = $"https://{Configuration["Auth0:Domain"]}/";
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.Authority = domain;
                options.Audience = Configuration["Auth0:ApiIdentifier"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });
            services.AddSignalR();
            services.AddHangfire(x => x.UseSqlServerStorage(Configuration.GetConnectionString("defaultConnection"), new SqlServerStorageOptions
            {
                CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                QueuePollInterval = TimeSpan.Zero,
                UseRecommendedIsolationLevel = true,
                DisableGlobalLocks = true
            }));
            services.AddHangfireServer();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHangfireDashboard("/dashboard", new DashboardOptions
            {
                Authorization = new[] { new HangFireAuthorizationFilter() },
                IsReadOnlyFunc = (DashboardContext context) => true
            });

            app.UseHttpsRedirection();

            app.UseRouting();
            //app.UseCors();

            //app.UseCors(options =>
            //       options.WithOrigins("https://172.22.1.22:4201")
            //       .AllowAnyMethod()
            //       .AllowAnyHeader()
            //       .AllowCredentials()
            //    );

            app.UseCors(options =>
                   options.WithOrigins("http://localhost:4200")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials()
                );

            //app.UseCors(options =>
            //         options.WithOrigins("https://prdsrm.imi-ksa.com/client")
            //         .AllowAnyMethod()
            //         .AllowAnyHeader()
            //         .AllowCredentials()
            //      );


            //app.UseCors(options =>
            //       options.WithOrigins("https://tstruhsrmapp01.imi-ksa.com")
            //       .AllowAnyMethod()
            //       .AllowAnyHeader()
            //       .AllowCredentials()
            //    );

            app.UseStaticFiles();
            //app.UseStaticFiles(new StaticFileOptions()
            //{
            //    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
            //    RequestPath = new PathString("/Resources")
            //});

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHangfireDashboard();
                endpoints.MapHub<AppHub>("/app-listener");
            });
        }
    }
}
