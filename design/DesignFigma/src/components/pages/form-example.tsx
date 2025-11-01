import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FormField, ValidationRules, InputMasks } from '../form-field';
import { DateRangePicker } from '../date-range-picker';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function FormExamplePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateRange, setDateRange] = useState<any>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1>Form Components Example</h1>
        <p className="text-muted-foreground">
          Demonstration of form validation, input masks, and date range picker
        </p>
      </div>

      {/* Success message */}
      {submitted && (
        <Alert className="bg-success/10 border-success">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Success!</AlertTitle>
          <AlertDescription>
            Form submitted successfully. All validation passed.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
          <CardDescription>
            Fill in the guest details. All fields are validated on blur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={setFirstName}
                placeholder="John"
                required
                helpText="Enter guest's legal first name"
                validationRules={[
                  ValidationRules.minLength(2),
                  ValidationRules.maxLength(50),
                ]}
              />
              
              <FormField
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={setLastName}
                placeholder="Doe"
                required
                helpText="Enter guest's legal last name"
                validationRules={[
                  ValidationRules.minLength(2),
                  ValidationRules.maxLength(50),
                ]}
              />
            </div>

            {/* Contact fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="john.doe@example.com"
                required
                helpText="We'll send confirmation to this email"
                validationRules={[ValidationRules.email]}
              />
              
              <FormField
                id="phone"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="(555) 123-4567"
                required
                helpText="10-digit phone number"
                mask={InputMasks.phone}
                validationRules={[
                  ValidationRules.pattern(
                    /^\(\d{3}\) \d{3}-\d{4}$/,
                    'Must be a valid phone number'
                  ),
                ]}
              />
            </div>

            {/* Date Range Picker */}
            <div>
              <label className="block mb-2">Stay Dates</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select check-in and check-out dates"
                disabledDates={(date) => date < new Date()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select your check-in and check-out dates. Past dates are disabled.
              </p>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Submit Reservation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle>Form Validation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2">Validation States</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Untouched:</strong> Normal appearance before user interaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Valid:</strong> Green border with check icon after validation passes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Invalid:</strong> Red border with error icon and message</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Disabled:</strong> Grayed out, not interactive</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2">Input Masks</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Phone:</strong> Automatically formats as (XXX) XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Date:</strong> Formats as MM/DD/YYYY</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span><strong>Currency:</strong> Formats as decimal with 2 places</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2">Accessibility</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>All fields have proper labels and help text</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Required fields marked with * and aria-required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Error messages use aria-describedby</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                <span>Tab order follows visual layout</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
