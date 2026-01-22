import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';

interface LiabilityWaiverProps {
  type: 'signup' | 'driver' | 'rider';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
}

const waiverContent = {
  signup: {
    title: 'General Liability Waiver',
    description: 'I acknowledge and accept the risks associated with carpooling',
    content: `GENERAL LIABILITY WAIVER AND RELEASE OF CLAIMS

By creating an account and using the Waypoint carpooling platform, I acknowledge and agree to the following:

1. ASSUMPTION OF RISK
I understand that participating in carpooling activities involves inherent risks, including but not limited to:
- Motor vehicle accidents
- Personal injury or property damage
- Adverse weather conditions
- Road hazards
- Actions of other drivers or passengers

2. RELEASE OF LIABILITY
I hereby release, waive, discharge, and covenant not to sue Waypoint, its operators, affiliates, employees, agents, and representatives from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury that may be sustained by me while participating in carpooling activities through this platform.

3. INDEMNIFICATION
I agree to indemnify and hold harmless Waypoint and its affiliates from any and all claims, actions, suits, costs, and expenses, including attorney fees, arising out of my participation in carpooling activities.

4. ACKNOWLEDGMENT
I acknowledge that I have read this waiver, understand its contents, and agree to its terms voluntarily.

5. MEDICAL AUTHORIZATION
In the event of an emergency, I authorize emergency medical treatment as deemed necessary by medical professionals.

This waiver is binding upon my heirs, executors, administrators, and assigns.`
  },
  driver: {
    title: 'Driver Liability Waiver',
    description: 'I accept responsibility as a driver and understand the associated risks',
    content: `DRIVER LIABILITY WAIVER AND AGREEMENT

By posting a ride on the Waypoint platform, I acknowledge and agree to the following:

1. DRIVER RESPONSIBILITIES
As a driver, I agree to:
- Maintain a valid driver's license and vehicle registration
- Maintain adequate auto insurance coverage
- Operate my vehicle in a safe and lawful manner
- Ensure my vehicle is properly maintained and roadworthy
- Follow all traffic laws and regulations
- Not operate my vehicle under the influence of alcohol or drugs

2. ASSUMPTION OF RISK
I understand that transporting passengers involves inherent risks and I accept full responsibility for:
- The safety of my passengers during the trip
- Any accidents or incidents that may occur
- Road conditions and weather-related hazards

3. RELEASE OF LIABILITY
I hereby release Waypoint from any and all liability for accidents, injuries, or damages that may occur during rides I provide. I understand that Waypoint is a platform for connecting drivers and riders and does not assume responsibility for the actions of drivers or riders.

4. INDEMNIFICATION
I agree to indemnify and hold harmless Waypoint from any claims, damages, or expenses arising from my driving activities or the transportation of passengers.

5. INSURANCE ACKNOWLEDGMENT
I acknowledge that my personal auto insurance is the primary coverage for any incidents that may occur and that Waypoint does not provide supplemental insurance coverage.

6. 16-MINUTE PICKUP WINDOW
I understand and agree to adhere to the 16-minute pickup window policy and will communicate promptly with riders regarding any delays or changes.`
  },
  rider: {
    title: 'Rider Liability Waiver',
    description: 'I accept the risks associated with carpooling as a rider',
    content: `RIDER LIABILITY WAIVER AND AGREEMENT

By joining a ride on the Waypoint platform, I acknowledge and agree to the following:

1. ASSUMPTION OF RISK
I understand that participating in carpooling as a passenger involves inherent risks, including but not limited to:
- Motor vehicle accidents
- Personal injury or property damage
- Delays or changes to scheduled trips
- Actions of drivers or other passengers

2. RELEASE OF LIABILITY
I hereby release Waypoint, its operators, and the driver from any and all liability for injuries, damages, or losses that may occur during the ride. I understand that I am traveling at my own risk.

3. RIDER RESPONSIBILITIES
As a rider, I agree to:
- Be ready at the designated pickup location on time
- Respect the driver's vehicle and property
- Follow the driver's reasonable requests
- Wear a seatbelt at all times during the trip
- Behave in a courteous and respectful manner

4. 16-MINUTE PICKUP WINDOW
I understand and agree to the 16-minute pickup window policy. I will be present at the pickup location during this window. If I fail to appear, the driver may leave without me and I accept this outcome.

5. COST CONTRIBUTION
I understand that any cost contribution I provide to the driver is for gas expenses only and does not constitute payment for a commercial transportation service.

6. INDEMNIFICATION
I agree to indemnify and hold harmless Waypoint and the driver from any claims arising from my participation in the ride, except those caused by the gross negligence or willful misconduct of the driver.`
  }
};

export function LiabilityWaiver({ type, checked, onCheckedChange, required = true }: LiabilityWaiverProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const waiver = waiverContent[type];

  return (
    <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div className="space-y-3 flex-1">
          <div>
            <p className="font-medium text-foreground text-sm">{waiver.title}</p>
            <p className="text-sm text-muted-foreground">{waiver.description}</p>
          </div>
          
          <div className="flex items-start gap-2">
            <Checkbox 
              id={`waiver-${type}`} 
              checked={checked} 
              onCheckedChange={(checked) => onCheckedChange(checked === true)}
              required={required}
            />
            <Label htmlFor={`waiver-${type}`} className="text-sm leading-tight cursor-pointer">
              I have read and agree to the{' '}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    type="button" 
                    className="text-primary hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {waiver.title}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>{waiver.title}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                      {waiver.content}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {required && <span className="text-destructive">*</span>}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
