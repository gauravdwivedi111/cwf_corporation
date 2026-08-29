import SiteSettings from '../models/SiteSettings.js';

/**
 * @desc    Get site settings (singleton). Creates a default record if database is unseeded.
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});

    // Auto-create default settings so GET never fails or returns empty
    if (!settings) {
      settings = await SiteSettings.create({
        companyPhone: '+91 20 1234 5678',
        companyEmail: 'info@cwfcorporation.com',
        address: {
          street: '101, Apex Commercial Hub, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          country: 'India',
        },
        socialLinks: {
          facebook: 'https://facebook.com/cwfcorporation',
          instagram: 'https://instagram.com/cwfcorporation',
          linkedin: 'https://linkedin.com/company/cwfcorporation',
          twitter: '',
          youtube: '',
        },
        businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
        aboutText: 'CWF Consulting Corporation Pune provides state of the art waterproofing consultation and structural inspection services.',
        certifications: ['ISO 9001:2015 Structural Safety Certified'],
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update site settings (singleton)
 * @route   PUT /api/settings
 * @access  Private (Superadmin only)
 */
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      // Create if missing
      settings = await SiteSettings.create(req.body);
    } else {
      // Update the existing singleton document
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
